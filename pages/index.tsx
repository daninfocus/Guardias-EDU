import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AuthCheck from "../components/AuthCheck";
import Login from "../components/Login";

const Home: NextPage = () => {
  return (
    <AuthCheck>
      <Login />
    </AuthCheck>
  );
};

export default Home;
