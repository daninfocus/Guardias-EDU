import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";

import { AuthContextProvider } from "../store/auth.context";
function MyApp({ Component, pageProps }: AppProps) {
  return (
      <AuthContextProvider>
        <div className="bg-white text-black font-serif">
          <Component {...pageProps} />
        </div>
      </AuthContextProvider>
  );
}

export default MyApp;
