import React from "react";

interface PartnerItem {
  id: number;
  name: string;
  logoUrl: string;
}

export default function PartnerSection() {
  const partners: PartnerItem[] = [
    { id: 1, name: "Kichi-Kichi", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNe86x5xqNT-SLjNnFGnRrrVag5IKJnk9JVaqFMRhxMrjdM5iSvMNHTtk&s=10" },
    { id: 2, name: "Golden Gate", logoUrl: "https://interbra.vn/public/DATA/2023/4-2023-28049.jpg" },
    { id: 3, name: "WinMart+", logoUrl: "https://winmart.s3-hcmc02.higiocloud.vn/logo_chin_su_4d7c7d1a05.png?v=2026-07-20T01%3A58%3A37.224Z" },
    { id: 4, name: "AEON Mall", logoUrl: "https://cdn1.vieclam24h.vn/images/employer_avatar/2026/06/17/aeon_178166124526.png" },
    { id: 5, name: "King BBQ", logoUrl: "https://scvivocity.com.vn/wp-content/uploads/2026/05/KING-Logo-Vua-nuong-HQ-chu-den.png" },
    { id: 6, name: "Lotus Group", logoUrl: "https://lotusgroup.com.vn/wp-content/uploads/2020/09/logo.png" },
  ];

  return (
    <section className="bg-[#ECA921] w-full py-10 sm:py-14 shadow-inner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h3 className="text-xl md:text-2xl font-bold tracking-wider text-white uppercase">
            ĐỐI TÁC KHÁNH AN FOODS
          </h3>
        </div>

        {/* Grid chia viền 6 ô */}
        <div className="grid grid-cols-2 lg:grid-cols-3 border-t border-l border-white/15">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group p-3 sm:p-5 border-r border-b border-white/15 flex items-center justify-center"
            >
              <div className="bg-white w-full h-24 sm:h-32 flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain filter grayscale opacity-65 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
