import React, { useContext, useEffect, useState } from "react";
import { logOut } from "../firebase/auth";
import { useRouter } from "next/router";
import GuardiasContext from "../context/GuardiasContext";
import College from "../@types/College";
import AuthContext from "../context/AuthContext";
import { deleteTeacherFromCollege } from "../firebase/firestore";
import FormContext from "../context/FormContext";
import Image from "next/image";
import { PrevButton } from "./calendar/buttons/PrevButton";
import CalendarContext from "../context/CalendarContext";
import { NextButton } from "./calendar/buttons/NextButton";
import GoToTodayButton from "./calendar/buttons/GoToTodayButton";
const Nav = (prop: { simpleNav: boolean }) => {
  const router = useRouter();

  //context
  const { college, user, isUserAdmin } = useContext(AuthContext);
  const { isFormOpen, openForm, closeForm } = useContext(FormContext);
  const { goToNextWeek, goToPreviousWeek, goToToday} = useContext(CalendarContext);

  //state
  const [isNavOpen, setIsNavOpen] = useState(false);

  //functions
  const logout = () => {
    logOut().then(() => router.push("/"));
  };

  const noLoginScreen = () => {
    router.push("/nologin/?collegeId=" + college.id);
  };

  const classes = () => {
    router.push("/schedule?collegeId=" + college.id);
  };

  const home = () => {
    router.push("/" + college.id, undefined, { scroll: true });
  };

  const workforce = () => {
    router.push("/workforce?collegeId=" + college.id, undefined, {
      scroll: true,
    });
  };

  const selectedStyle = (pathname: string) => {
    return router.pathname == pathname
      ? "cursor-pointer text-md text-blue-600 font-bold hover:text-blue-400"
      : "cursor-pointer text-md text-gray-400 hover:text-gray-500 ";
  };

  const deleteUserFromCollege = async () => {
    if (college != undefined && user) {
      if (college.teachers!.length > 0 || college.admins!.length > 0) {
        if (
          confirm(
            "Quieres darte de baja en este instituto? Podras unirte otra vez de nuevo."
          )
        ) {
          await deleteTeacherFromCollege(college.id!, user?.email!);
          logout();
        }
      } else {
        alert(
          "Eres el ultimo admin del instituto, quedara este instituto en limbo!"
        );
      }
    }
  };

  return (
    <div className="w-full">
      <nav className="relative px-3 py-2 grid justify-between items-center bg-gray-100 shadow-xl rounded-2xl"
        style={{
          gridTemplateColumns: "80px repeat(3, 1fr)",
        }}
      >
        <div className="flex flex-row justify-start z-40">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="navbar-burger flex items-center  p-3"
          >
            {/* <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg> */}
            <div
              className={`flex flex-col z-40 transform transition-all duration-300 ${
                isNavOpen ? "translate-x-80" : ""
              }`}
            >
              <span
                className={`bg-gray-700 w-5 h-1 mt-[3px] shadow-none box-s text-black rounded-sm transform transition-all duration-300 ${
                  isNavOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`bg-gray-700 w-5 h-1 mt-[3px] rounded-sm transform transition-all duration-300 ${
                  isNavOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`bg-gray-700 w-5 h-1 mt-[3px] rounded-sm transform transition-all duration-300 ${
                  isNavOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {!prop.simpleNav &&
          <div className="flex flex-row gap-2">
            <PrevButton goToPreviousWeek={goToPreviousWeek} />
            <GoToTodayButton goToToday={goToToday}/>
            <NextButton goToNextWeek={goToNextWeek} />
          </div>
        }
        
        <div className="flex flex-row justify-center">
          {!prop.simpleNav && college && college.name != "Cargando..." ? (
            <button
              className="shadow-md sm:block sm:visible hidden invisible text-xs sm:text-sm self-center  py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition duration-200"
              type="button"
              onClick={() => {
                openForm(new Date());
                setIsNavOpen(false);
                router.push("/" + college.id);
              }}
            >
              Registrar Ausencia
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className=" md:text-xl text-sm font-bold flex flex-row justify-end">
          {college.name}
        </div>
      </nav>

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

        <hr className="visible md:hidden mb-9"></hr>
        <div>
          <ul>
            <li>
              <a
                className={selectedStyle("/[collegeId]")}
                onClick={() => home()}
              >
                Calendario
              </a>
            </li>
            <li className="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                className="w-4 h-4 current-fill"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </li>
            <li>
              <a
                className={selectedStyle("/workforce")}
                onClick={() => workforce()}
              >
                Personal
              </a>
            </li>
            {isUserAdmin() && (
              <>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>
                <li>
                  <a
                    className={selectedStyle("/schedule")}
                    onClick={() => classes()}
                  >
                    Clases y Horario
                  </a>
                </li>
              </>
            )}
            {isUserAdmin() && (
              <>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>
                <li>
                  <a
                    className={selectedStyle("/nologin")}
                    onClick={() => noLoginScreen()}
                  >
                    Pantalla sin login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

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
          {/* <button
                  className="m-auto text-xs text-slate-600"
                  onClick={() => deleteUserFromCollege()}
                >
                  Darte de baja en este Instituto
                </button> */}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
