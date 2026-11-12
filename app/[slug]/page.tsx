import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBlocksRenderer } from "@/components/PageBlocksRenderer";
import { getCmsData } from "@/lib/cms-store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getCmsData().customPages.find(
    (p) => p.published && p.slug === slug
  );
  if (!page) return { title: "Страница не найдена" };
  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function CustomTemplatePage({ params }: Props) {
  const { slug } = await params;
  const page = getCmsData().customPages.find(
    (p) => p.published && p.slug === slug
  );
  if (!page) notFound();

  return (
    <>
      <Header />
      <main id="home" tabIndex={-1} style={{ paddingTop: "2rem" }}>
        <PageBlocksRenderer blocks={page.blocks} />
      </main>
      <Footer />
    </>
  );
}