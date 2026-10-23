import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Cột 1: Thông tin công ty & Logo */}
          <div className="space-y-4">
            {/* Tạo khung chứa logo nền sáng nhẹ để chữ "KHÁNH AN" màu tối nổi bật 100% */}
            <div className="inline-block bg-white/95 p-3 rounded-xl shadow-sm border border-amber-100">
              <img
                src="/logo2.png"
                alt="Khánh An Foods Logo"
                className="h-14 w-auto object-contain"
              />
            </div>

            <p className="text-xs font-semibold text-gray-200 leading-relaxed tracking-wide">
              CÔNG TY TNHH PHÂN PHỐI THỰC PHẨM TOÀN CẦU
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Chuyên cung cấp & phân phối thực phẩm nhập khẩu, thực phẩm tươi
              sống đạt tiêu chuẩn quốc tế cho chuỗi nhà hàng, siêu thị.
            </p>
          </div>

          {/* Cột 2: Danh mục chính */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Danh Mục
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-[#ECA921] transition-colors"
                >
                  Surimi & Viên thả lẩu
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-[#ECA921] transition-colors"
                >
                  Sauce
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-[#ECA921] transition-colors"
                >
                  Gia công ODM & OEM
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-[#ECA921] transition-colors"
                >
                  RTC & RTE
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chính sách & Điều khoản */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Chính Sách
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-[#ECA921] transition-colors">
                  Quy trình kiểm định chất lượng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#ECA921] transition-colors">
                  Chính sách giao hàng Cold-Chain
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#ECA921] transition-colors">
                  Chính sách đổi trả & hoàn tiền
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#ECA921] transition-colors">
                  Bảo mật thông tin khách hàng
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Kho hàng */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Liên Hệ Kho Hàng
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p>
                <strong className="text-gray-200">Trụ sở:</strong>15 Đường số
                39, Phường Thủ Đức, TP. Hồ Chí Minh
              </p>
              <p>
                <strong className="text-gray-200">Hotline:</strong>{" "}
                0829387980
              </p>
              <p>
                <strong className="text-gray-200">Email:</strong>{" "}
                khanh.nd@khanhanfoods.com
              </p>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2026 FoodCatalog. All rights reserved.</p>
          <p>Mã số doanh nghiệp: 0317387980.</p>
        </div>
      </div>
    </footer>
  );
}
