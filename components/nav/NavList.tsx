import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useRouter } from "next/router";

const NavList = () => {
  const router = useRouter();

  const { college, isUserAdmin } = useContext(AuthContext);

  const selectedStyle = (pathname: string) => {
    return router.pathname == pathname
      ? "cursor-pointer text-md text-blue-600 font-bold hover:text-blue-400"
      : "cursor-pointer text-md text-gray-400 hover:text-gray-500 ";
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
  return (
    <div>
      <hr className="visible md:hidden mb-9"></hr>
      <ul>
        <li>
          <a className={selectedStyle("/[collegeId]")} onClick={() => home()}>
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
  );
};

export default NavList;
