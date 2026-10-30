import React from "react";

interface CertificateItem {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
}

export default function AboutSection() {
  const certList: CertificateItem[] = [
    {
      id: 1,
      title: "Chứng Nhận HACCP",
      desc: "Giấy chứng nhận QUẢN LÝ AN TOÀN THỰC PHẨM - HACCP Codex 2020 số 3202200578 cấp ngày 17/09/2022",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/23/HACCP_Certified_Logo.svg", // Hoặc đường dẫn ảnh chứng nhận của bạn
    },
    {
      id: 2,
      title: "Bao Bì Công Bố Sản Phẩm",
      desc: "Công bố SP số 01/khanhanfoods/2023 , niêm yết tại website Ban Quản lý an toàn Thực phẩm TP. HCM",
      imageUrl:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=300",
    },
    {
      id: 3,
      title: "Đăng Ký Doanh Nghiệp",
      desc: "Chứng nhận Đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP. HCM cấp - Công ty TNHH KHÁNH AN FOODS",
      imageUrl:
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=300",
    },
    {
      id: 4,
      title: "Kết Quả Kiểm Nghiệm",
      desc: "Bản Kết quả thử nghiệm Sản phẩm mã số TSL/1221100483-1 tại Trung tâm kiểm nghiệm TSL",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300",
    },
  ];

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8   ">
        {/* 1. Tiêu đề & Giới thiệu */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#ECA921] mb-6 uppercase">
            VỀ CHÚNG TÔI
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Khánh An Foods sở hữu thương hiệu{" "}
            <strong className="text-gray-800">Chả Mực Khánh An</strong> nổi
            tiếng - món đặc sản truyền thống Hạ Long được phân phối tại các siêu
            thị đặc sản và các nhà hàng tại TP. HCM. Khánh An Foods là doanh
            nghiệp uy tín trong thị trường phân phối các dòng sản phẩm thực phẩm
            nhập khẩu cho các công ty chế biến, hệ thống siêu thị, nhà hàng,
            quán ăn... Với hệ thống kho xưởng đảm bảo an toàn thực phẩm, hồ sơ
            công bố, kiểm nghiệm sản phẩm đúng quy định, quản lý theo tiêu chuẩn
            HACCP. Doanh nghiệp chúng tôi hân hạnh được đồng hành cùng quý khách
            hàng.
          </p>
        </div>

        {/* 2. Danh sách chứng nhận dạng hình tròn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {certList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center group"
            >
              {/* Vòng tròn ảnh */}
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-amber-100 group-hover:border-[#ECA921] shadow-md transition-all duration-300 mb-4 bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Tiêu đề & Mô tả */}
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#ECA921] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed px-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
