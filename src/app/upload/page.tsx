import { cookies } from "next/headers";

import UploadLoginCard from "@/components/upload/UploadLoginCard";
import UploadProjectForm from "@/components/upload/UploadProjectForm";
import { getPortfolioProjects } from "@/lib/projects";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

export default async function UploadPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(UPLOAD_SESSION_COOKIE)?.value;
  const isAuthenticated = isUploadSessionValid(sessionCookie);
  const projects = isAuthenticated ? await getPortfolioProjects() : [];

  return (
    <main className="min-h-[calc(100vh-180px)] px-2 md:px-0">
      {isAuthenticated ? <UploadProjectForm initialProjects={projects} /> : <UploadLoginCard />}
    </main>
  );
}
