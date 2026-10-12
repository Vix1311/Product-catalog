"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconMeat,
  IconFish,
  IconSoup,
  IconBottle,
  IconBeer,
  IconPackage,
  IconClock,
  IconFlame,
  IconTools,
  IconChevronDown,
} from "@tabler/icons-react";

export interface CategoryItem {
  name: string;
  desc: string;
  link: string;
  icon: React.ReactNode;
}

// DANH SÁCH CHUẨN 9 NGÀNH HÀNG KHÁNH AN FOODS
export const categoriesList: CategoryItem[] = [
  {
    name: "Thịt Nhập Khẩu",
    desc: "Bò Mỹ, Bò Úc, Heo, Cừu đông lạnh",
    link: "/catalog?group=thit-nhap-khau",
    icon: <IconMeat className="w-5 h-5 text-[#ECA921]" />,
  },
  {
    name: "Surimi & Chả Cá",
    desc: "Thanh cua, chả cá, viên thả lẩu",
    link: "/catalog?group=surimi",
    icon: <IconFish className="w-5 h-5 text-amber-600" />,
  },
  {
    name: "Sauce / Nước Sốt",
    desc: "Sốt lẩu, sốt ướp BBQ, sốt chấm",
    link: "/catalog?group=sauce",
    icon: <IconSoup className="w-5 h-5 text-amber-600" />,
  },
  {
    name: "Mayonnaise",
    desc: "Sốt béo, sốt trộn salad, dressing",
    link: "/catalog?group=mayonnaise",
    icon: <IconBottle className="w-5 h-5 text-[#ECA921]" />,
  },
  {
    name: "Bia & Đồ Uống",
    desc: "Bia nhập khẩu, nước giải khát",
    link: "/catalog?group=bia",
    icon: <IconBeer className="w-5 h-5 text-amber-600" />,
  },
  {
    name: "Chà Bông Heo / Gà",
    desc: "Ruốc xù, chà bông gà cay, ruốc heo",
    link: "/catalog?group=cha-bong",
    icon: <IconPackage className="w-5 h-5 text-amber-600" />,
  },
  {
    name: "RTE (Ăn Liền)",
    desc: "Thực phẩm Ready To Eat đóng gói",
    link: "/catalog?group=rte",
    icon: <IconClock className="w-5 h-5 text-[#ECA921]" />,
  },
  {
    name: "RTC (Sơ Chế Sẵn)",
    desc: "Thịt, cá tẩm ướp sẵn Ready To Cook",
    link: "/catalog?group=rtc",
    icon: <IconFlame className="w-5 h-5 text-amber-600" />,
  },
  {
    name: "Gia Công OEM / ODM",
    desc: "Sản xuất & đóng gói theo yêu cầu B2B",
    link: "/catalog?group=oem-odm",
    icon: <IconTools className="w-5 h-5 text-amber-600" />,
  },
];

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Nút Trigger trên Desktop */}
      <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gray-800 hover:text-[#ECA921] transition-colors rounded-lg hover:bg-amber-50/50">
        <span>Danh Mục Sản Phẩm</span>
        <IconChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ECA921]" : ""
          }`}
        />
      </button>

      {/* Popover MegaMenu Grid 3 Cột trên Desktop */}
      {isOpen && (
        <div className="absolute top-full left-0 w-[680px] bg-white rounded-2xl shadow-2xl border border-amber-100 p-5 z-50 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {categoriesList.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-all group"
            >
              <div className="p-2 rounded-lg bg-amber-100/50 group-hover:bg-amber-200/60 transition-colors">
                {cat.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#ECA921] transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
