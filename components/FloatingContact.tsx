"use client";

import React, { useState } from "react";
import { IconPhone, IconHeadset, IconX } from "@tabler/icons-react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const zaloPhone = "0399829074";

  // Hàm xử lý gọi thẳng App Zalo trên máy (PC & Mobile)
  const handleZaloClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 1. Gọi thẳng giao thức ứng dụng Zalo trên thiết bị
    window.location.href = `zalo://conversation?phone=${zaloPhone}`;

    // 2. Dự phòng: Nếu sau 1.5s trình duyệt vẫn giữ focus (máy không có App Zalo) thì mới mở Web
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(`https://zalo.me/${zaloPhone}`, "_blank");
      }
    }, 1500);
  };

  const contactLinks = [
    {
      id: "phone",
      label: "Gọi Hotline ",
      value: "039 982 9074",
      href: `tel:${zaloPhone}`,
      icon: <IconPhone className="w-5 h-5 text-white" stroke={2} />,
      bgColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      id: "zalo",
      label: "Chat Zalo",
      value: "Zalo Khánh An Foods",
      href: `zalo://conversation?phone=${zaloPhone}`,
      onClick: handleZaloClick, // Gắn sự kiện mở App
      icon: <img src="/Icon_of_Zalo.svg" alt="Zalo Icon" className="w-5 h-5" />,
      bgColor: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    /* 🎯 1. Thêm pointer-events-none ở đây để vùng khoảng không không che đè lên nội dung bên dưới */
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
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
            onClick={item.onClick}
            className="flex items-center gap-3 group pointer-events-auto cursor-pointer"
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

      {/* 🎯 2. Bật pointer-events-auto riêng cho nút tròn chính để vẫn nhận click mở menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Liên hệ Khánh An"
        className="pointer-events-auto cursor-pointer relative group w-14 h-14 rounded-full bg-[#ECA921] text-white flex items-center justify-center shadow-2xl hover:bg-[#D89512] transition-all duration-300 focus:outline-none border-2 border-white"
      >
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
