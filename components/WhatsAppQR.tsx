"use client";

import { QRCodeSVG } from "qrcode.react";

const WA_URL = "https://wa.me/33753791617";

export default function WhatsAppQR() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <QRCodeSVG
          value={WA_URL}
          size={160}
          fgColor="#25D366"
          bgColor="#ffffff"
          level="M"
        />
      </div>
      <p className="text-gray-400 text-xs text-center leading-snug">
        Flashez depuis votre téléphone
      </p>
    </div>
  );
}
