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
      if (user) {
        const college = await doesUserHaveCollegeAssigned(user.uid);

        if (college != undefined) {
          router.push("/" + college.id);
        } else {
          router.push("/college");
        }
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
