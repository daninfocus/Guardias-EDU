import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AuthCheck from "../components/auth/AuthCheck";
import Login from "../components/auth/Login";

const Home: NextPage = () => {
  return (
    <AuthCheck>
      <a href="https://guardias-sync.vercel.app/en/calendar?showToday=false">Ir a GAP 2.0</a>
      {/* <Login /> */}
    </AuthCheck>
  );
};

export default Home;
