"use client";

import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const removeCookie = async () => {
    try {
      document.cookie = `accessToken=; path=/`;

      console.log(document.cookie);
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full h-full flex justify-center align-middle relative">
      <button
        type="submit"
        className="fixed right-2 top-0 cursor-pointer"
        id="logoutbtn"
        onClick={removeCookie}
      >
        logout
      </button>
      Dashboard
    </div>
  );
};

export default Dashboard;
