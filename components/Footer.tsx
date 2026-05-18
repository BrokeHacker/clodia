import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t px-6 md:px-10 py-10" style={{ background: "#fff", borderColor: "var(--gray-200)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}
          >
            clodia
          </span>
          <p className="text-xs mt-1" style={{ color: "var(--gray-400)" }}>
            Repas gastronomiques livrés à l&rsquo;hôpital · Limoges
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#comment-ca-marche" className="text-xs font-medium transition-colors hover:text-gray-900" style={{ color: "var(--gray-400)" }}>
            Comment ça marche
          </a>
          <a href="#formules" className="text-xs font-medium transition-colors hover:text-gray-900" style={{ color: "var(--gray-400)" }}>
            Formules
          </a>
          <Link href="/mon-compte" className="text-xs font-medium transition-colors hover:text-gray-900" style={{ color: "var(--gray-400)" }}>
            Mon espace
          </Link>
          <Link href="/admin" className="text-xs font-medium transition-colors hover:text-gray-900" style={{ color: "var(--gray-400)" }}>
            Admin
          </Link>
        </div>

        <p className="text-xs" style={{ color: "var(--gray-200)" }}>
          © {new Date().getFullYear()} Clodia
        </p>
      </div>
    </footer>
  );
}
