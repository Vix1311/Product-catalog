import { Badge } from "@/components/ui/badge";

export default function TrustSection() {
  const criteria = [
    {
      icon: "🌱",
      title: "Nguồn Gốc Minh Bạch",
      desc: "100% sản phẩm được nhập khẩu chính ngạch hoặc từ các trang trại đạt chuẩn GlobalGAP.",
    },
    {
      icon: "❄️",
      title: "Bảo Quản Đạt Chuẩn",
      desc: "Hệ thống kho lạnh Cold-Chain hiện đại, đảm bảo nhiệt độ tối ưu từ kho đến tay khách hàng.",
    },
    {
      icon: "🤝",
      title: "Đối Tác Tận Tâm",
      desc: "Đồng hành cùng hàng trăm nhà hàng, khách sạn và chuỗi siêu thị trên toàn quốc.",
    },
  ];

  const certifications = [
    { name: "HACCP Certified", desc: "An toàn vệ sinh thực phẩm" },
    { name: "ISO 22000:2018", desc: "Quản lý an toàn thực phẩm" },
    { name: "USDA Organic", desc: "Tiêu chuẩn hữu cơ Mỹ" },
    { name: "GlobalG.A.P", desc: "Nông nghiệp tốt toàn cầu" },
  ];

  const partners = [
    "Kichi-Kichi",
    "Golden Gate Group",
    "WinMart+",
    "AEON Mall",
    "King BBQ",
    "Lotus Group",
  ];

  return (
    <section className="space-y-16 py-12">
      {/* 1. Tiêu chí làm việc */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Tiêu Chí Hoạt Động
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Chúng tôi đặt chất lượng và sự an toàn của người tiêu dùng lên hàng
            đầu.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {criteria.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Chứng nhận & Tiêu chuẩn chất lượng */}
      <div className="bg-[#4A2E16] text-white rounded-2xl p-8 md:p-12 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="bg-[#ECA921] text-white mb-3">
            CHỨNG NHẬN QUỐC TẾ
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold">
            Cam Kết Tiêu Chuẩn Chất Lượng
          </h2>
          <p className="text-[#ECA921] text-sm mt-2">
            Các dòng thực phẩm phân phối đều trải qua kiểm định nghiêm ngặt.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center"
            >
              <div className="text-lg font-black text-[#ECA921] mb-1">
                {cert.name}
              </div>
              <div className="text-xs text-gray-300">{cert.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Đối tác phân phối */}
      <div className="text-center">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
          ĐỐI TÁC PHÂN PHỐI & KHÁCH HÀNG THÂN THIẾT
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
          {partners.map((partner, index) => (
            <span
              key={index}
              className="text-lg md:text-xl font-black text-gray-600 hover:text-[#ECA921] cursor-pointer"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
