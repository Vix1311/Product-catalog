"use client";

import React, { useEffect, useState } from "react";
import {
  IconAward,
  IconShieldCheck,
  IconTruckDelivery,
  IconBuildingWarehouse,
  IconUsersGroup,
  IconWorld,
  IconPhoneCall,
  IconMapPin,
  IconMail,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";
import { logoutApi } from "../services/auth.service";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";

export default function AboutCompanyPage() {
  const stats = [
    {
      label: "Năm kinh nghiệm",
      value: "10+",
      sub: "Trong ngành thực phẩm B2B",
    },
    {
      label: "Đối tác HORECA",
      value: "1,500+",
      sub: "Nhà hàng, Khách sạn, Siêu thị",
    },
    {
      label: "Danh mục sản phẩm",
      value: "300+",
      sub: "Thịt nhập khẩu & Hải sản",
    },
    {
      label: "Kho lạnh tiêu chuẩn",
      value: "-18°C",
      sub: "Bảo quản chuẩn quốc tế",
    },
  ];

  const coreValues = [
    {
      title: "Nguồn Gốc Minh Bạch",
      desc: "100% sản phẩm nhập khẩu chính ngạch từ Úc, Mỹ, Brazil, Nga, Nhật Bản với đầy đủ chứng nhận CO/CQ và kiểm dịch VSATTP.",
      icon: <IconShieldCheck className="w-7 h-7 text-[#ECA921]" />,
      bgClass: "bg-[#ECA921]",
    },
    {
      title: "Chuỗi Cung Ứng Lạnh Chuẩn Quốc Tế",
      desc: "Hệ thống kho cấp đông sâu và xe tải lạnh chuyên dụng đảm bảo cấu trúc thịt, độ tươi ngọt nguyên bản đến tận bếp nhà hàng.",
      icon: <IconBuildingWarehouse className="w-7 h-7 text-[#ECA921]" />,
      bgClass: "bg-[#B8731B]",
    },
    {
      title: "Gia Công Cắt Thái Theo Yêu Cầu (ODM/OEM)",
      desc: "Hỗ trợ cắt lát mỏng (Hotpot/BBQ), cắt Steak định lượng chuẩn xác, đóng gói hút chân không giúp tối ưu chi phí vận hành bếp.",
      icon: <IconAward className="w-7 h-7 text-[#ECA921]" />,
      bgClass: "bg-[#D98A1C]",
    },
    {
      title: "Giao Hàng Nhanh & Ổn Định Giá Sỉ",
      desc: "Cam kết bình ổn giá cho hợp đồng dài hạn, đáp ứng sản lượng lớn và giao hàng đúng tiến độ cho chuỗi nhà hàng, bếp ăn công nghiệp.",
      icon: <IconTruckDelivery className="w-7 h-7 text-[#ECA921]" />,
      bgClass: "bg-[#8C5210]",
    },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const loggedInState = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(!!(token && loggedInState === "true"));
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Lỗi logout API:", error);
    } finally {
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div
            className="w-full rounded-[28px] py-14 px-6 text-center shadow-2xl border border-amber-500/20"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #1F150D 25%, #4A2809 50%, #1F150D 75%, #0B0F17 100%)",
            }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#ECA921]/40 bg-[#ECA921]/10 mb-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#ECA921]">
                KHÁNH AN FOODS PROFILE
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FFF3D1] drop-shadow-sm">
              VỀ KHÁNH AN FOODS
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-normal leading-relaxed">
              Đối tác cung ứng thực phẩm nhập khẩu, thủy hải sản & Surimi đạt
              tiêu chuẩn chất lượng quốc tế cho chuỗi nhà hàng, khách sạn và
              siêu thị.
            </p>
          </div>
        </div>

        {/* 1. THỐNG KÊ NỔI BẬT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#ECA921]">
                  {item.value}
                </div>
                <div className="text-sm font-bold text-gray-900 mt-1">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. CÂU CHUYỆN THƯƠNG HIỆU & BIO CÔNG TY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Cột Trái: Nội dung giới thiệu */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8731B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <IconWorld className="w-4 h-4" /> Hồ Sơ Năng Lực Doanh Nghiệp
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Kiến Tạo Chuẩn Mực Mới Trong Ngành Cung Ứng{" "}
                <span className="text-[#ECA921]">Thực Phẩm Sỉ B2B</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                <strong>Khánh An Foods</strong> tự hào là đơn vị tiên phong
                chuyên nhập khẩu và phân phối trực tiếp các dòng thịt bò, thịt
                heo, thịt gà cao cấp, thủy hải sản và các chế phẩm Surimi chất
                lượng cao tại thị trường Việt Nam.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Thấu hiểu bài toán cốt lõi của các chuỗi nhà hàng Lẩu - Nướng
                (Hotpot & BBQ), Steakhouse, Bếp ăn công nghiệp và Siêu thị là{" "}
                <strong className="text-gray-900">
                  chất lượng đồng đều, định lượng chuẩn xác và nguồn cung ổn
                  định
                </strong>
                , chúng tôi xây dựng quy trình khép kín từ khâu tuyển chọn
                thương hiệu quốc tế (Kilcoy, Swift, Excel, JBS, Miratorg...) cho
                đến khâu sơ chế, cắt thái theo tiêu chuẩn riêng của từng bếp.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Hồ sơ pháp lý, VSATTP, CO/CQ đầy đủ",
                  "Nhập khẩu trực tiếp không qua trung gian",
                  "Đội ngũ tư vấn am hiểu chuyên sâu từng phần thịt",
                  "Hỗ trợ mẫu thử (Sample) tận nơi cho Bếp trưởng",
                ].map((point, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm font-semibold text-gray-800"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#ECA921]/20 text-[#B8731B] flex items-center justify-center shrink-0">
                      <IconCheck className="w-3.5 h-3.5" stroke={3} />
                    </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>

            {/* Cột Phải: Hình ảnh & Thẻ Cam Kết */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border-2 border-[#ECA921]/40 shadow-xl h-80 sm:h-96 bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                  alt="Khánh An Foods Kho Lạnh & Sản Phẩm"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:absolute -bottom-5 -left-5 bg-gray-900 text-white p-5 rounded-2xl shadow-xl border border-amber-500/30 max-w-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#ECA921]">
                  Sứ mệnh của chúng tôi
                </div>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  “Mang nguồn nguyên liệu chuẩn nhà hàng 5 sao đến mọi căn bếp
                  Việt với mức giá sỉ tối ưu nhất.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DẢI 4 Ô MÀU VÀNG - NÂU ĐỒNG BỘ THEO HÌNH 1 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8731B]">
              THẾ MẠNH CỐT LÕI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Tại Sao Hơn 1,500+ Đối Tác Chọn Khánh An?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-3xl overflow-hidden shadow-xl">
            {coreValues.map((item, idx) => (
              <div
                key={idx}
                className={`${item.bgClass} text-white p-7 flex flex-col justify-between min-h-[260px] transition-transform hover:brightness-105`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-900/90 flex items-center justify-center shadow-md mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-extrabold leading-snug mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold">
                  <span>Tiêu chuẩn Khánh An</span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-900 text-[#ECA921] text-[10px]">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. THÔNG TIN LIÊN HỆ B2B / HỢP TÁC */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div
            className="rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-amber-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #2B1806 50%, #0B0F17 100%)",
            }}
          >
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ECA921] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                ĐỐI TÁC CUNG ỨNG B2B & ODM/OEM
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#FFF3D1]">
                Nhận Bảng Giá Sỉ & Hồ Sơ Năng Lực Ngay Hôm Nay
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Liên hệ trực tiếp với phòng kinh doanh Khánh An Foods để nhận
                báo giá ưu đãi theo sản lượng và chính sách chiết khấu dành
                riêng cho đại lý, nhà hàng.
              </p>
              <div className="pt-3 flex flex-wrap gap-6 text-xs sm:text-sm text-amber-100">
                <div className="flex items-center gap-2">
                  <IconPhoneCall className="w-5 h-5 text-[#ECA921]" />
                  <span>
                    Hotline/Zalo: <strong>082 938 7980</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-5 h-5 text-[#ECA921]" />
                  <span>
                    Email: <strong>khanh.nd@khanhanfoods.com</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              <a
                href="tel:0399829074"
                className="px-6 py-3.5 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-extrabold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Gọi Hotline Tư Vấn <IconArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/san-pham"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center"
              >
                Xem Danh Mục Sản Phẩm
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
