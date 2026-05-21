import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#4D0F1F] text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-2">
            <p className="text-3xl font-semibold mb-4">Clodia</p>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Des repas sur mesure livrés chaque midi aux soignants du CHU
              et des cliniques de Limoges. Parce que vous méritez de bien manger.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
              Navigation
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/notre-histoire" className="text-white/70 hover:text-white transition-colors">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="text-white/70 hover:text-white transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/nos-engagements" className="text-white/70 hover:text-white transition-colors">
                  Nos engagements
                </Link>
              </li>
              <li>
                <Link href="/formules" className="text-white/70 hover:text-white transition-colors">
                  Formules
                </Link>
              </li>
              <li>
                <Link href="/commander" className="text-white/70 hover:text-white transition-colors">
                  Commander
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
              Informations
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-white/70 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2025 Clodia. Tous droits réservés.</p>
          <p>Conçu avec soin pour les soignants de Limoges</p>
        </div>
      </div>
    </footer>
  );
}
