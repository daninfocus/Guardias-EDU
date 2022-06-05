import React, { useState } from "react";
import { signInAnonymous, signInWithGoogle } from "../../firebase/auth";
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
        const college = await doesUserHaveCollegeAssigned(data.uid);
        setLoading(false);
        
        if (college != undefined) {
          console.log(college.id);
          router.replace("/" + college.id);
        } else {
          router.replace("/college");
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
      <p className="font-normal text-5xl mb-16">Guardias-EDU</p>
      <iframe
        className="h-3/6"
        src="https://embed.lottiefiles.com/animation/101662"
      ></iframe>
      <p className="text-base my-6">
        Organiza tu tiempo libre con la de tus compañeros.
      </p>
      <div className="flex">
        <LoadingButton
          size="small"
          loading={loading}
          variant="contained"
          onClick={LoginWithGoogle}
          className="hover:bg-red-500 rounded-xl p-2.5 hover:text-white text-gray-700 font-bold"
        >
          <span className="flex flex-row items-center justify-between ">
            {!loading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
            ) : (
              <div className="h-[48px] w-[48px]"></div>
            )}
            &nbsp; Log in with Google
          </span>
        </LoadingButton>
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
    </div>
  );
}

export default Login;
