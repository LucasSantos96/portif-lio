import type { Metadata } from "next";

import RoadmapPage, { roadmapMetadata } from "@/components/roadmap/RoadmapPage";

export const metadata: Metadata = roadmapMetadata("en");

export default function Page() {
  return <RoadmapPage locale="en" />;
}
