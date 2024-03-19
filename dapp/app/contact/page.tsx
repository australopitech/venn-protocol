import Contact from "./contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Venn",
  description: "Reach out and we'll get back to you ASAP"
}

export default function Page () {
  return <Contact />
}