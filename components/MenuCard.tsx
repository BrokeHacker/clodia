import Image from "next/image";
import type { Menu } from "@/lib/data";

interface MenuCardProps {
  menu: Menu;
}

export default function MenuCard({ menu }: MenuCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="relative aspect-[4/3]">
        <Image
          src={menu.photo}
          alt={menu.plat}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 280px"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#EAFF33] text-[#4D0F1F] text-xs font-semibold px-3 py-1 rounded-full">
            {menu.jourSemaine} {menu.date}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-[#4D0F1F] text-sm leading-snug">
          {menu.plat}
        </h3>

        <p className="text-xs text-[#007FFF] flex items-start gap-1.5">
          <span className="shrink-0 mt-0.5">🌿</span>
          <span>{menu.platVege}</span>
        </p>

        <p className="text-xs text-gray-400 flex items-start gap-1.5">
          <span className="shrink-0 mt-0.5">🍮</span>
          <span>{menu.dessert}</span>
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[#FF9933] font-semibold text-lg">
            {menu.prix.toFixed(2).replace(".", ",")} €
          </span>
          <span className="text-xs text-gray-300 bg-gray-50 px-2 py-1 rounded-full">
            plat + dessert
          </span>
        </div>
      </div>
    </div>
  );
}
