import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SEVEN_DAYS = 7 * 24 * 60 * 60; // Khớp 7d của Refresh Token bên BE

function saveSession(accessToken: string, refreshToken?: string) {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
  localStorage.setItem("isLoggedIn", "true");

  // Đồng bộ Cookie cho middleware.ts
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${SEVEN_DAYS}; SameSite=Lax`;
  document.cookie = `isLoggedIn=true; path=/; max-age=${SEVEN_DAYS}; SameSite=Lax`;
}

export function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isLoggedIn");

  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie =
    "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  window.dispatchEvent(new Event("storage"));
}

// 1. ĐĂNG NHẬP
export async function loginApi(email: string, password: string) {
  const { data } = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });

  if (!data?.access_token) {
    throw new Error("Không nhận được token từ hệ thống!");
  }

  saveSession(data.access_token, data.refresh_token);
  return data;
}

// 2. REFRESH TOKEN (Có khóa chống gọi trùng khi nhiều API cùng dính 401)
let refreshingPromise: Promise<string> | null = null;

export async function refreshTokenApi(): Promise<string> {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Không có Refresh Token");

      const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
        refreshToken,
      });

      if (!data?.access_token) {
        throw new Error("Không nhận được Access Token mới");
      }

      saveSession(data.access_token, data.refresh_token);
      return data.access_token as string;
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

// 3. ĐĂNG XUẤT
export async function logoutApi() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    }
  } catch (err) {
    console.error("Lỗi gọi API Logout:", err);
  } finally {
    clearSession();
  }
}

// 4. WRAPPER FETCH TỰ ĐỘNG GẮN TOKEN & REFRESH KHI DÍNH 401
export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  // Access Token hết hạn -> gọi /api/auth/refresh -> chạy lại đúng request vừa lỗi
  if (response.status === 401) {
    try {
      const newToken = await refreshTokenApi();
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, { ...options, headers });
    } catch {
      window.location.href = "/";
    }
  }

  return response;
}
