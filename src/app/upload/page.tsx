import type { Metadata } from "next";
import { cookies } from "next/headers";

import UploadArticleForm from "@/components/upload/UploadArticleForm";
import UploadLoginCard from "@/components/upload/UploadLoginCard";
import UploadProjectForm from "@/components/upload/UploadProjectForm";
import UploadTabs from "@/components/upload/UploadTabs";
import { getAllArticles } from "@/lib/articles";
import { getPortfolioProjects } from "@/lib/projects";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

// Painel privado: fora da busca e sem passar autoridade para os links.
export const metadata: Metadata = {
  title: "Gerenciar projetos",
  robots: { index: false, follow: false },
};

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(UPLOAD_SESSION_COOKIE)?.value;
  const isAuthenticated = isUploadSessionValid(sessionCookie);
  const tab = (await searchParams).tab === "artigos" ? "artigos" : "projetos";

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen px-2 pt-6 md:px-0">
        <UploadLoginCard />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-2 pt-2 md:px-0">
      <UploadTabs active={tab} />
      {tab === "artigos" ? (
        <UploadArticleForm initialArticles={await getAllArticles()} />
      ) : (
        <UploadProjectForm initialProjects={await getPortfolioProjects()} />
      )}
    </main>
  );
}
