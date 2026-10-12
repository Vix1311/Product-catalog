import Link from "next/link";

interface CategoryBannerItem {
  id: number;
  title: string;
  subtitle: string;
  bgColor: string;
  imageUrl: string;
  link: string;
}

export default function CategoryBanners() {
  const categories: CategoryBannerItem[] = [
    {
      id: 1,
      title: "Chả Mực Hạ Long",
      subtitle: "Đặc Sản Gia Truyền",
      bgColor: "bg-[#ECA921]", // Vàng ấm
      imageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300",
      link: "/catalog?group=cha-muc",
    },
    {
      id: 2,
      title: "Thực Phẩm Sức Khoẻ",
      subtitle: "Lẩu Đông Trùng Hạ Thảo Tươi",
      bgColor: "bg-[#7A4B27]", // Nâu sẫm
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300",
      link: "/catalog?group=suc-khoe",
    },
    {
      id: 3,
      title: "Ẩm Thực Đặc Sản",
      subtitle: "Hàu Sữa Hạ Long Chưng Thịt",
      bgColor: "bg-[#ECA921]", // Rêu đậm
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=300",
      link: "/catalog?group=dac-san",
    },
    {
      id: 4,
      title: "Nguyên Liệu Nhà Hàng",
      subtitle: "Giá Sỉ, Hồ Sơ SP Đạt Chuẩn",
      bgColor: "bg-[#683C21]", // Nâu cà phê
      imageUrl:
        "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=300",
      link: "/catalog?group=nguyen-lieu",
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`${cat.bgColor} text-white p-6 md:p-8 flex items-center justify-between min-h-[220px] relative overflow-hidden transition-transform hover:z-10`}
          >
            {/* Nội dung bên trái */}
            <div className="space-y-3 z-10 max-w-[60%]">
              <h3 className="text-xl md:text-2xl font-bold leading-tight">
                {cat.title}
              </h3>
              <p className="text-xs md:text-sm text-white/80 font-light line-clamp-2">
                {cat.subtitle}
              </p>
              <div>
                <Link href={cat.link}>
                  <button className="bg-[#242938] hover:bg-[#1a1e29] text-white text-xs font-medium px-4 py-2 rounded-md shadow transition-colors">
                    Xem ngay
                  </button>
                </Link>
              </div>
            </div>

            {/* Hình ảnh bên phải */}
            <div className="w-28 h-28 md:w-36 md:h-36 relative flex-shrink-0 flex items-center justify-center">
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
