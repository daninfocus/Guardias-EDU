import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { doesUserHaveCollegeAssigned } from "../../firebase/firestore";
import Loading from "../Loading";
import Login from "./Login";

function AuthCheck({ children }: any) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    async function checkLogin() {
      if (user && user.email) {
        const college = await doesUserHaveCollegeAssigned(user.email);
        
        if (college != undefined) {
          if (router.pathname.includes("nologin")) {
            router.push("/nologin?collegeId=" + college.id, undefined, {
              scroll: true,
            });
          }else{
            if (router.pathname.includes("professors")) {
              router.push("/professors?collegeId=" + college.id, undefined, {
                scroll: true,
              });
            } else {
              if (router.pathname.includes("schedule")) {
                router.push("/schedule?collegeId=" + college.id, undefined, {
                  scroll: true,
                });
              } else {
                router.push("/" + college.id);
              }
            }
          }
        } else {
          router.push("/login");
        }
      }else{
        router.push("/login");
      }
    }
    checkLogin();
  }, [loading]);
  

  if (user && !loading && router.pathname !== "/") {
    return children;
  } else if (!user && !loading) {
    return <Login />;
  } else {
    return <Loading />;
  }
}

export default AuthCheck;
