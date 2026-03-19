import type { AppProps } from "next/app";

// import { useEffect } from "react";
// import useAuth from "@/hooks/useAuth";

export default function App({ Component, pageProps }: AppProps) {
  //   const {}=useAuth()
  // useEffect(() => {
  //   useAuth.hydrate(); // runs once on every full page load / refresh
  // }, []);

  return <Component {...pageProps} />;
  //      ↑ renders the actual page inside this wrapper
}
