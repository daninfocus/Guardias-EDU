import React, { useEffect, useState } from "react";
import { logOut, signInAnonymous, signInWithGoogle } from "../../firebase/auth";
import { doesUserHaveCollegeAssigned } from "../../firebase/firestore";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import LoadingButton from "@mui/lab/LoadingButton";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const LoginWithGoogle = async () => {
    setLoading(true);
    signInWithGoogle()
      .then(async (data) => {
        if (data) {
          const college = await doesUserHaveCollegeAssigned(
            data.email!.toString()
          );

          if (college != undefined) {
            router.push("/" + college.id);
          } else {
            await logOut();
            toast(
              "No estas asignado a ningun instituto habla con tu Coordinador TDE",
              {
                icon: "⛔️",
              }
            );
            router.push("/login");
          }
          setLoading(false);
        } else {
          setLoading(false);
          toast("Tu dominio no corresponde con este instituto", {
            icon: "⛔️",
          });
          router.push("/login");
        }
      })
      .catch((error) => {
        setLoading(false);
        toast(error.message, {
          icon: "⛔️",
        });
      });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-green ">
      <div className="font-normal text-5xl mb-1 items-center">GAP</div>
      <div className="text-xs">(Gestión de Ausencias de Profesorado)</div>
      <iframe
        className="h-3/6"
        src="https://embed.lottiefiles.com/animation/101662"
      ></iframe>
      <div className="text-base my-6 text-center">
        Sistemas de gestión para guardias de Institutos de Educación Secundaria.
        <div className="text-xs text-center">
          Diseñado y programado en el IES Fernando III - Martos (Jaén)
        </div>
      </div>
      <div className="px-6 sm:px-0 max-w-sm">
        <button
          type="button"
          className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
          onClick={LoginWithGoogle}
        >
          <svg
            className="mr-2 -ml-1 w-4 h-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
          Sign in with Google
        </button>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          // Define default options
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
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
}

export default Login;
