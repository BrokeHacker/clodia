import type { Metadata } from "next";
import FormulesClient from "./FormulesClient";

export const metadata: Metadata = {
  title: "Nos formules — Clodia",
  description: "Choisissez votre formule Clodia.",
};

export default function FormulesPage() {
  return <FormulesClient />;
}
