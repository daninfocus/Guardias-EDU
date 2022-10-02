import React, { useContext, useState } from "react";
import { logOut } from "../firebase/auth";
import { useRouter } from "next/router";
import GuardiasContext from "../context/GuardiasContext";
import College from "../@types/College";
import AuthContext from "../context/AuthContext";
import { deleteTeacherFromCollege } from "../firebase/firestore";
import { route } from "next/dist/server/router";

const Nav = (prop: { simpleNav: boolean }) => {
  const router = useRouter();

  //context
  const { user } = useContext(AuthContext);
  const { college } = useContext(GuardiasContext);
  const { setShowGuardiaForm } = useContext(GuardiasContext);
  const { setPressedNewGuardia } = useContext(GuardiasContext);
  const { isUserAdmin } = useContext(GuardiasContext);
  const { loadingGuardias } = useContext(GuardiasContext);

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
    router.push("/classes?collegeId=" + college.id);
  };

  const home = () => {
    router.push("/" + college.id, undefined, { scroll: true });
  };

  const professors = () => {
    router.push("/professors?collegeId=" + college.id, undefined, {
      scroll: true,
    });
  };

  const selectedStyle = (pathname: string) => {
    return router.pathname == pathname
      ? "cursor-pointer text-md text-blue-600 font-bold hover:text-blue-400"
      : "cursor-pointer text-md text-gray-400 hover:text-gray-500 ";
  };

  const deleteUserFromCollege = async () => {
    if (college != undefined) {
      if (college.teachers!.length > 0 || college.admins!.length > 0) {
        if (
          confirm(
            "Quieres darte de baja en este instituto? Podras unirte otra vez de nuevo."
          )
        ) {
          await deleteTeacherFromCollege(college.id!, user);
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
    <div className="w-full ">
      <nav className="relative px-3 py-2 grid grid-cols-3 justify-between items-center bg-gray-100 shadow-xl rounded-2xl">
        <div className=" md:text-xl text-sm font-bold font-josefin">
          {college.name}
        </div>
        <div className="flex flex-row justify-center">
          {!prop.simpleNav && college && college.name != "Cargando..." ? (
            <button
              className="shadow-md sm:block sm:visible hidden invisible text-xs sm:text-sm self-center  py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition duration-200"
              type="button"
              onClick={() => {
                setShowGuardiaForm(true);
                setIsNavOpen(false);
                setPressedNewGuardia(true);
                router.push("/" + college.id);
              }}
            >
              Registrar Ausencia
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-row justify-end">
          <button
            onClick={() => setIsNavOpen(true)}
            className="navbar-burger flex items-center text-blue-600 p-3"
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </nav>
      {isNavOpen ? (
        <div className="navbar-menu relative z-50">
          <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center mb-8">
              <a className="mr-auto text-3xl font-bold leading-none" href="#">
                <svg
                  className="h-12"
                  aria-labelledby="logo"
                  viewBox="0 0 100 100"
                >
                  <path d="M100 34.2c-.4-2.6-3.3-4-5.3-5.3-3.6-2.4-7.1-4.7-10.7-7.1-8.5-5.7-17.1-11.4-25.6-17.1-2-1.3-4-2.7-6-4-1.4-1-3.3-1-4.8 0-5.7 3.8-11.5 7.7-17.2 11.5L5.2 29C3 30.4.1 31.8 0 34.8c-.1 3.3 0 6.7 0 10v16c0 2.9-.6 6.3 2.1 8.1 6.4 4.4 12.9 8.6 19.4 12.9 8 5.3 16 10.7 24 16 2.2 1.5 4.4 3.1 7.1 1.3 2.3-1.5 4.5-3 6.8-4.5 8.9-5.9 17.8-11.9 26.7-17.8l9.9-6.6c.6-.4 1.3-.8 1.9-1.3 1.4-1 2-2.4 2-4.1V37.3c.1-1.1.2-2.1.1-3.1 0-.1 0 .2 0 0zM54.3 12.3L88 34.8 73 44.9 54.3 32.4V12.3zm-8.6 0v20L27.1 44.8 12 34.8l33.7-22.5zM8.6 42.8L19.3 50 8.6 57.2V42.8zm37.1 44.9L12 65.2l15-10.1 18.6 12.5v20.1zM50 60.2L34.8 50 50 39.8 65.2 50 50 60.2zm4.3 27.5v-20l18.6-12.5 15 10.1-33.6 22.4zm37.1-30.5L80.7 50l10.8-7.2-.1 14.4z"></path>
                </svg>
              </a>

              <button
                onClick={() => setIsNavOpen(false)}
                className="navbar-close"
              >
                <svg
                  className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            {college && college.name != "Cargando..." &&
            <button
              className="visible sm:hidden mx-auto mb-9 py-2 px-6 bg-orange-500 hover:bg-orange-600 text-sm text-white font-bold rounded-xl transition duration-200"
              type="button"
              onClick={() => {
                setShowGuardiaForm(true);
                setIsNavOpen(false);
                setPressedNewGuardia(true);
                router.push("/" + college.id);
              }}
            >
              Registrar Ausencia
            </button>}

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
                    className={selectedStyle("/professors")}
                    onClick={() => professors()}
                  >
                    Profesorado
                  </a>
                </li>
                {isUserAdmin && (
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
                        className={selectedStyle("/classes")}
                        onClick={() => classes()}
                      >
                        Editar Clases
                      </a>
                    </li>
                  </>
                )}
                {isUserAdmin && (
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default Nav;
