import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AuthCheck from "../components/auth/AuthCheck";
import Login from "../components/auth/Login";
import { Suspense } from "react";
import Loading from "../components/Loading";

const Home: NextPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AuthCheck>
        <Login />
      </AuthCheck>
    </Suspense>
  );
};

export default Home;
