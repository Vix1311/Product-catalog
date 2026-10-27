import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // 👈 Thay đúng URL Backend của bạn

// 1. HAM DANG NHAP
export async function loginApi(email: string, password: string) {
  const response = await axios.post(`${API_URL}/login`, { email, password });

  // Lấy dữ liệu trả về từ API (Response body)
  const data = response.data;

  // Giả sử API trả về { accessToken: "...", refreshToken: "..." } hoặc { token: "..." }
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token;

  if (accessToken) {
    // 🚀 LƯU VÀO LOCALSTORAGE
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("isLoggedIn", "true");
  } else {
    throw new Error("Không nhận được token từ hệ thống!");
  }

  return data;
}

export async function refreshTokenApi() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    logoutApi(); // Nếu Refresh Token cũng hết hạn -> Bắt đăng xuất luôn
    throw error;
  }
}
// 2. HAM DANG XUAT
export async function logoutApi() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    if (refreshToken && accessToken) {
      await axios.post(
        `${API_URL}/logout`,
        { refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    }
  } catch (err) {
    console.error("Lỗi gọi API Logout:", err);
  } finally {
    // 🧹 DỌN DẸP SACH SẼ LOCALSTORAGE
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");
  }
}
