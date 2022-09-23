import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";
import { GuardiasContextProvider } from "../context/GuardiasContext";

import { GuardiasNoLoginContextProvider } from "../context/GuardiasNoLoginContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <AuthContextProvider>
        <GuardiasContextProvider>
          <GuardiasNoLoginContextProvider>
            <div className="flex flex-col h-screen  ">
              <Component {...pageProps} />
            </div>
          </GuardiasNoLoginContextProvider>
        </GuardiasContextProvider>
      </AuthContextProvider>
    </React.StrictMode>
  );
}

export default MyApp;
