import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAllRoadmapParticipants } from "@/lib/roadmap";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

export async function GET() {
  const cookieStore = await cookies();

  if (!isUploadSessionValid(cookieStore.get(UPLOAD_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const participants = await getAllRoadmapParticipants();
  return NextResponse.json({ participants });
}
