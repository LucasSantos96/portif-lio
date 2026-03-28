import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

interface GithubRepoBody {
  repoUrl?: string;
}

interface GithubRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  full_name: string;
}

function parseGithubRepository(repoUrl: string) {
  try {
    const url = new URL(repoUrl);

    if (url.hostname !== "github.com") {
      return null;
    }

    const [owner, repo] = url.pathname
      .replace(/^\//, "")
      .replace(/\.git$/, "")
      .split("/");

    if (!owner || !repo) {
      return null;
    }

    return { owner, repo };
  } catch {
    return null;
  }
}

function normalizeTechnologies(topics: string[], languages: string[]) {
  const joined = [...topics, ...languages]
    .map((item) => item.trim())
    .filter(Boolean);

  return [...new Set(joined)];
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(UPLOAD_SESSION_COOKIE)?.value;

  if (!isUploadSessionValid(sessionCookie)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as GithubRepoBody;

  if (!body.repoUrl) {
    return NextResponse.json(
      { message: "Informe a URL do repositório GitHub." },
      { status: 400 },
    );
  }

  const parsedRepo = parseGithubRepository(body.repoUrl);

  if (!parsedRepo) {
    return NextResponse.json(
      { message: "URL do GitHub inválida. Use https://github.com/owner/repo" },
      { status: 400 },
    );
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const repoApiUrl = `https://api.github.com/repos/${parsedRepo.owner}/${parsedRepo.repo}`;
  const languagesApiUrl = `${repoApiUrl}/languages`;

  const [repoResponse, languagesResponse] = await Promise.all([
    fetch(repoApiUrl, { headers, cache: "no-store" }),
    fetch(languagesApiUrl, { headers, cache: "no-store" }),
  ]);

  if (!repoResponse.ok) {
    return NextResponse.json(
      { message: "Não consegui buscar esse repositório no GitHub." },
      { status: repoResponse.status },
    );
  }

  const repo = (await repoResponse.json()) as GithubRepoResponse;

  const languages = languagesResponse.ok
    ? Object.keys((await languagesResponse.json()) as Record<string, number>)
    : [];

  const technologies = normalizeTechnologies(repo.topics ?? [], languages);

  return NextResponse.json({
    title: repo.name,
    description: repo.description ?? "",
    projectUrl: repo.homepage || repo.html_url,
    imageUrl: `https://opengraph.githubassets.com/1/${repo.full_name}`,
    githubRepo: repo.html_url,
    technologies,
  });
}
