import { useGlobalContext } from "@/context/maincontext";
import api from "@/lib/api/axios";

export function useHydrate() {
  const { setUserData } = useGlobalContext();

  return async () => {
    try {
      const { data } = await api.get("/auth/me");
      document.cookie = `accessToken=${data?.body.accessToken}; path=/`;
      setUserData({
        ...data?.body,
      });
    } catch {
      // const res = await api.delete("/auth/logout");
      // msg.success(res.data.message);
      // document.cookie = `accessToken=; path=/`;
      // console.log(document.cookie);
      // router.refresh();
    }
  };
}
