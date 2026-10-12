"use client";
import { Product } from "../types/types";
export const ProductDetailModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 z-10 transition-colors"
        >
          <svg
            className="w-5 h-5 hover:cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="md:w-2/5 bg-gray-50 flex items-center justify-center p-6 border-r border-gray-100">
          <img
            src={
              product.image || "https://via.placeholder.com/400?text=No+Image"
            }
            alt={product.name}
            className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain drop-shadow-md rounded mix-blend-multiply"
          />
        </div>

        <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {product.name}
            </h2>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold mb-2">
              {product.group}
            </span>
          </div>

          <p className="text-sm text-gray-500 italic mb-4 pb-4 border-b border-gray-200">
            {product.enName}
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Đặc điểm sản phẩm
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {product.brandAnalysis && (
                <div className="bg-blue-50/50 border-l-4 border-blue-400 p-3 rounded-r-md">
                  <h3 className="text-xs font-bold text-blue-800 uppercase mb-1">
                    💡 Phân tích thương hiệu
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    {product.brandAnalysis}
                  </p>
                </div>
              )}
              <div className="bg-gray-50 p-4 border-l-4 border-gray-300">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">
                  Quy cách & Cắt hàng
                </h3>
                <p className="text-sm text-gray-800 mt-1 font-medium whitespace-pre-line">
                  {product.spec}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="md:col-span-1 border-t md:border-t-0 border-gray-200 pt-3 md:pt-0 md:pl-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">
                  Xuất xứ tham khảo
                </h3>
                <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                  {product.brandOrigin || "Đang cập nhật"}
                </p>
              </div>
              <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">
                  Quy cách đóng thùng
                </h3>
                <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                  {product.pack}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="text-orange-500">🏬</span> Phù hợp kênh quán
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.channel}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="text-green-500">🍲</span> Gợi ý món ăn
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.dishes?.split(",").map((dish, idx) => (
                  <span
                    key={idx}
                    className="bg-green-50 text-green-700 text-xs px-2 py-1 border border-green-200 rounded-full"
                  >
                    {dish.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
