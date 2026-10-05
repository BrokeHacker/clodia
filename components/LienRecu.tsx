// Lien « Reçu » d'une commande payée : ouvre le reçu Stripe du paiement (le même pour toutes les commandes d'un même paiement)
export default function LienRecu({ reference }: { reference: string }) {
  return (
    <a
      href={`/api/espace-client/recu?ref=${encodeURIComponent(reference)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#F7F5F0] transition-colors"
      style={{ fontSize: "12px", color: "#4A4A4A", fontWeight: 600, border: "1.5px solid #E8E3D8", borderRadius: "999px", padding: "5px 14px", whiteSpace: "nowrap", lineHeight: 1.2, textDecoration: "none" }}
    >
      <i className="ti ti-receipt" style={{ fontSize: 14 }} aria-hidden="true" />
      Reçu
    </a>
  )
}
