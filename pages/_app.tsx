import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";
import { GuardiasContextProvider } from "../context/GuardiasContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <AuthContextProvider>
        <GuardiasContextProvider>
          <div className="bg-white text-black font-serif">
            <Component {...pageProps} />
          </div>
        </GuardiasContextProvider>
      </AuthContextProvider>
    </React.StrictMode>
  );
}

export default MyApp;
