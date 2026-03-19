"use client";

import env from "@/config/env";
import { useGlobalContext } from "@/context/maincontext";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Callback = () => {
  const AbortRef = useRef<AbortController | null>(null);
  const { setUserData } = useGlobalContext();
  const { msg } = useGlobalContext();
  const router = useRouter();

  const getUserData = async () => {
    try {
      const code = new URLSearchParams(window.location.href).get("code");

      const { data } = await axios.post(
        env.apiBaseUrl + "/auth/login/google",
        {},
        {
          headers: {
            code: code,
          },
          signal: AbortRef.current?.signal,
        },
      );
      console.log(data);
      document.cookie = `accessToken=${data?.body.accessToken}; path=/`;
      setUserData({
        ...data?.body,
      });
      msg.success(data?.message);
      router.push("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        msg.warning(err.response?.data?.message);
      } else {
        msg.warning("Access token not found");
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    AbortRef.current = abortController;
    getUserData();
    return () => {
      AbortRef.current?.abort();
    };
  }, []);

  return <div>Please wait login inprogress</div>;
};

export default Callback;
