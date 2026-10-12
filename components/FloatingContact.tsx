"use client";

import React, { useState } from "react";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconHeadset,
  IconX,
} from "@tabler/icons-react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const contactLinks = [
    {
      id: "phone",
      label: "Gọi Hotline B2B",
      value: "0900 123 456",
      href: "tel:0900123456",
      icon: <IconPhone className="w-5 h-5 text-white" stroke={2} />,
      bgColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      id: "zalo",
      label: "Chat Zalo B2B",
      value: "Zalo Khánh An Foods",
      href: "https://zalo.me/0900123456",
      icon: <img src="/Icon_of_Zalo.svg" alt="Zalo Icon" className="w-5 h-5" />,
      bgColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "email",
      label: "Gửi Email Báo Giá",
      value: "contact@foodcatalog.vn",
      href: "mailto:contact@foodcatalog.vn",
      icon: <IconMail className="w-5 h-5 text-white" stroke={2} />,
      bgColor: "bg-[#ECA921] hover:bg-[#D89512]",
    },
    {
      id: "location",
      label: "Xem Kho Lạnh / Trụ Sở",
      value: "KCN Tân Bình, TP.HCM",
      href: "https://maps.google.com",
      icon: <IconMapPin className="w-5 h-5 text-white" stroke={2} />,
      bgColor: "bg-red-600 hover:bg-red-700",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 1. MENU CÁC KÊNH LIÊN HỆ */}
      <div
        className={`flex flex-col gap-3 mb-4 transition-all duration-300 transform origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        {contactLinks.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            {/* Nhãn chữ bên trái */}
            <div className="bg-gray-900/90 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-md backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-amber-100/20">
              <span className="block text-[#ECA921] font-bold">
                {item.label}
              </span>
              <span className="text-[11px] text-gray-300 font-normal">
                {item.value}
              </span>
            </div>

            {/* Icon Tabler hình tròn */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${item.bgColor} transition-transform transform group-hover:scale-110`}
            >
              {item.icon}
            </div>
          </a>
        ))}
      </div>

      {/* 2. NÚT CHÍNH NỔI (TRIGGER BUTTON) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Liên hệ Khánh An"
        className="relative group w-14 h-14 rounded-full bg-[#ECA921] text-white flex items-center justify-center shadow-2xl hover:bg-[#D89512] transition-all duration-300 focus:outline-none border-2 border-white"
      >
        {/* Icon Tabler: Headset / X */}
        <div className="transition-transform duration-300 transform">
          {isOpen ? (
            <IconX className="w-6 h-6 text-white" stroke={2.5} />
          ) : (
            <IconHeadset className="w-6 h-6 text-white" stroke={2} />
          )}
        </div>
      </button>
    </div>
  );
}
