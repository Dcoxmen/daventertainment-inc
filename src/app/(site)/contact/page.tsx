import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | David Cox",
  description: "Contact David Cox about full stack engineering, AI integration, and contract or full-time roles.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
