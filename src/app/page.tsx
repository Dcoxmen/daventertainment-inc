import type { Metadata } from "next";
import Experience from "@/components/experience/Experience";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <Experience />;
}
