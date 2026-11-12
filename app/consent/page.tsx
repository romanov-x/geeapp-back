import { permanentRedirect } from "next/navigation";
export default function ConsentRedirect() {
  permanentRedirect("/legal#consent-1");
}