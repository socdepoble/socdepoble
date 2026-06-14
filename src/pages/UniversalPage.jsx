import React from "react";
import UniversalCard from "../components/ui/UniversalCard";
import "../components/ui/universal-card.css";

/**
 * UniversalPage
 * Props:
 * - cards: Array of card props compatibles amb UniversalCard
 */
export default function UniversalPage({ cards = [] }) {
  return (
    <main className="universal-page" role="main" style={{ padding: "1rem", maxWidth: 900, margin: "0 auto" }}>
      {cards.length === 0 ? null : cards.map((c) => <UniversalCard key={c.id} {...c} />)}
    </main>
  );
}
