import React from "react";
import "../styles/globals.css";
import "../styles/tiptap-styles.scss"
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";
import { GuardiasContextProvider } from "../context/GuardiasContext";

import { GuardiasNoLoginContextProvider } from "../context/GuardiasNoLoginContext";
import { FormContextProvider } from "../context/FormContext";
import { CalendarContextProvider } from "../context/CalendarContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <AuthContextProvider>
        <CalendarContextProvider>
          <GuardiasContextProvider>
            <FormContextProvider>
              <GuardiasNoLoginContextProvider>
                <div className="flex flex-col h-screen  ">
                  <Component {...pageProps} />
                  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                  <link rel="manifest" href="/site.webmanifest"/>
                  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                  <meta name="msapplication-TileColor" content="#da532c"/>
                  <meta name="theme-color" content="#ffffff"/>
                </div>
              </GuardiasNoLoginContextProvider>
            </FormContextProvider>
          </GuardiasContextProvider>
        </CalendarContextProvider>
      </AuthContextProvider>
    </React.StrictMode>
  );
}

export default MyApp;
