"use client";
import { Product } from "../types/types";

export const ProductList = ({
  products,
  viewMode,
  onSelectProduct,
}: {
  products: Product[];
  viewMode: "grid" | "table";
  onSelectProduct: (p: Product) => void;
}) => {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer flex flex-col border border-gray-100 group"
          >
            <div className="h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
              <img
                src={p.image || "https://via.placeholder.com/200?text=No+Image"}
                alt={p.name}
                className="max-h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105 duration-300"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded w-max mb-2">
                {p.group}
              </span>
              <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">
                {p.name}
              </h3>
              <p className="text-gray-500 text-xs italic mb-3 line-clamp-1">
                {p.enName}
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold text-gray-800">Cắt hàng:</span>{" "}
                  <span className="line-clamp-1">{p.spec?.split(";")[0]}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Kênh:</span>{" "}
                  <span className="line-clamp-1">{p.channel}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold text-left">
            <tr>
              <th className="px-4 py-3 w-20 text-center">Ảnh</th>
              <th className="px-4 py-3 min-w-[200px]">Tên Sản Phẩm</th>
              <th className="px-4 py-3 w-24">Nhóm</th>
              <th className="px-4 py-3 min-w-[200px]">Quy Cách</th>
              <th className="px-4 py-3 min-w-[200px]">Kênh Quán</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-2">
                  <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1">
                    <img
                      src={p.image || "https://via.placeholder.com/50?text=IMG"}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <p className="font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500 italic">{p.enName}</p>
                </td>
                <td className="px-4 py-2 items-center justify-center ">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 rounded px-1">
                    {p.group}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">
                  <p className="line-clamp-2">{p.spec}</p>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  <p className="line-clamp-2">{p.channel}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
