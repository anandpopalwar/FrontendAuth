import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface customInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry: boolean;
}
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

export default api;

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("document cookie", document.cookie);

    // const str: string = "accessToken=token.token.token; path=/";
    const accessToken: string = getCookieValue(document.cookie, "accessToken");

    if (!document.cookie || !accessToken) {
      const _err: Error = new Error();
      _err.message = "cookie not found, login!";
      throw _err;
    }

    console.log({ accessToken });

    config.headers.Authorization = "Bearer " + accessToken;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as customInternalAxiosRequestConfig;
    console.log(originalRequest);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.get("/auth/refresh");

        if (!data.body?.accessToken) {
          throw new Error("access token not found");
        }

        document.cookie = `accessToken=${data?.body.accessToken}; path=/`;

        return api(originalRequest);
      } catch (refreshErr: AxiosError) {
        if (refreshErr.response?.status === 404) {
          // 1. Clear the cookie by setting an expired date
          document.cookie = "accessToken=; path=/;";

          // 2. Redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        console.error("Refresh token expired. Logging out...");
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

const getCookieValue = (cookieStr: string, name: string): string => {
  const match = cookieStr.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
};
