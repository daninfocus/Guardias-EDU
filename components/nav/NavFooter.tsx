import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { logOut } from "../../firebase/auth";
import { useRouter } from "next/router";

const NavFooter = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  
  const logout = () => {
    logOut().then(() => router.push("/"));
  };

  return (
    <div className="mt-auto flex flex-col items-center">
      <div className="m-auto p-5 text-sm text-slate-600">
        Estás logueado cómo:
        <p className=" font-medium">{user != null ? user.email : ""}</p>
      </div>

      <button
        className="lg:inline-block py-2 px-6 bg-red-500 hover:bg-red-600 text-sm text-white font-bold rounded-xl transition duration-200"
        onClick={() => logout()}
      >
        Cerrar Sesión
      </button>
      <p className="my-4 text-xs text-center text-gray-400">
        <span>
          © {new Date().getFullYear()}{" "}
          <a target="blank" href="https://www.danielwebb.dev/">
            Daniel Webb
          </a>
        </span>
      </p>
    </div>
  );
};

export default NavFooter;
