import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import FormContext from "../../context/FormContext";
import Image from "next/image";
import { useRouter } from "next/router";
import NavList from "./NavList";

interface NavSideBarProps {
  setIsNavOpen: any;
  isNavOpen: any;
}

const NavSideBar: React.FC<NavSideBarProps> = ({ setIsNavOpen, isNavOpen }) => {
  const router = useRouter();
  const { college, user, isUserAdmin } = useContext(AuthContext);
  const { isFormOpen, openForm, closeForm } = useContext(FormContext);

  return (
    <>
      <div
        onClick={() => setIsNavOpen(false)}
        className={`navbar-backdrop fixed inset-0 bg-gray-800 transform duration-150 z-30 ${
          isNavOpen ? "visible opacity-25" : "invisible opacity-0"
        }`}
      ></div>

      <nav
        className={`navbar-menu absolute top-0 z-30 transition-transform duration-300  transform h-full w-full ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 bottom-0 flex flex-col md:w-5/6 w-full md:max-w-sm py-4 px-4 bg-white border-r overflow-y-auto`}
      >
        <div className="flex flex-row justify-between mb-8">
          <Image
            src={"/android-chrome-512x512.png"}
            alt="icon"
            width="50"
            height="50"
          />
        </div>
        {college && college.name != "Cargando..." && (
          <button
            className="visible sm:hidden mx-auto mb-9 py-2 px-6 bg-orange-500 hover:bg-orange-600 text-sm text-white font-bold rounded-xl transition duration-200"
            type="button"
            onClick={() => {
              openForm(new Date());
              setIsNavOpen(false);
              router.push("/" + college.id);
            }}
          >
            Registrar Ausencia
          </button>
        )}

        <NavList />
      </nav>
    </>
  );
};

export default NavSideBar;
