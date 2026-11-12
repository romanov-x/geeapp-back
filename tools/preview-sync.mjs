import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

function git(cwd, ...args) {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    timeout: 30000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message || result.stderr.trim() || "Git command failed");
  }
  return result.stdout.trim();
}

export function syncOnce(cwd = process.cwd()) {
  if (git(cwd, "branch", "--show-current") !== "main") {
    return "Paused: switch to main to sync the preview.";
  }
  if (git(cwd, "status", "--porcelain")) {
    return "Paused: local changes found. Commit them before syncing.";
  }
  git(cwd, "fetch", "--quiet", "origin", "main");
  const current = git(cwd, "rev-parse", "HEAD");
  const latest = git(cwd, "rev-parse", "origin/main");
  if (current === latest) return "Up to date.";
  // Check again after the network request; never overwrite local edits.
  if (git(cwd, "branch", "--show-current") !== "main" ||
      git(cwd, "status", "--porcelain")) {
    return "Paused: the working tree changed during fetch.";
  }
  const dependenciesChanged = git(
    cwd, "diff", "--name-only", current, latest, "--", "package.json", "package-lock.json"
  );
  git(cwd, "merge", "--ff-only", "--no-edit", "origin/main");
  return dependenciesChanged
    ? "Updated to " + latest.slice(0, 7) + ". Dependencies changed: run npm ci and restart npm run dev."
    : "Updated to " + latest.slice(0, 7) + ". Next.js dev will refresh the preview.";
}

async function watch() {
  console.log("Preview sync: checking origin/main every 5 seconds. Stop with Ctrl+C.");
  let previous = "";
  while (true) {
    let message;
    try {
      message = syncOnce();
    } catch (error) {
      message = "Sync paused: " + error.message;
    }
    if (message !== previous) {
      console.log(new Date().toLocaleTimeString() + " " + message);
      previous = message;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await watch();
}
