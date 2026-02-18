"use client";

import { useGlobalContext } from "@/context/maincontext";
import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Dashboard = () => {
  const { msg } = useGlobalContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [value, setValue] = useState<number>(0);
  const router = useRouter();
  const removeCookie = async () => {
    try {
      const res = await api.delete("/auth/logout");
      msg.success(res.data.message);
      document.cookie = `accessToken=; path=/`;
      console.log(document.cookie);

      router.refresh();
    } catch (err) {
      console.log(err);
      document.cookie = `accessToken=; path=/`;
      router.refresh();
    }
  };
  const callRandomData = async () => {
    try {
      const res = await api.get("/randomdata");
      console.log(res);
      setValue(res.data.data.random);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      callRandomData();
    }, 5000);

    return () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full flex justify-center align-middle ">
      <button
        type="submit"
        className="absolute right-2 top-0 cursor-pointer"
        id="logoutbtn"
        onClick={removeCookie}
      >
        logout
      </button>
      <div className="grid justify-center">
        <h2 className="flex justify-center align-middle text-3xl font-bold center w-100">
          Dashboard
        </h2>

        <h4 className="flex text-red-600 text-2xl font-bold justify-center align-middle">
          value from backend :{value}
        </h4>
      </div>
    </div>
  );
};

export default Dashboard;
