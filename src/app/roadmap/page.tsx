import type { Metadata } from "next";

import RoadmapPage, { roadmapMetadata } from "@/components/roadmap/RoadmapPage";

export const metadata: Metadata = roadmapMetadata("pt");

export default function Page() {
  return <RoadmapPage locale="pt" />;
}
