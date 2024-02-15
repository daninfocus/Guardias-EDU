import React, { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import useGuardias from '../hooks/useGuardias';
import College from '../@types/College';
import { useRouter } from "next/router";
import { getCollegeDataById } from '../firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isUserAdmin: () => boolean;
  college: College
}

const initialUser : any = null;

const initialAuthContext: AuthContextType = {
  user: initialUser,
  loading: false, // Assuming initial loading state is false
  isUserAdmin: () => false, // Default function returning false
  college: new College()
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

export function AuthContextProvider({children}: any) {

  const router = useRouter();

  const collegeId = router.query.collegeId

  const [user, setUser] = useState<User>(initialUser);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [college, setCollege] = useState<College>(new College())

  // Simplified useEffect to fetch college data
  useEffect(() => {
    async function fetchData() {
      if (collegeId != undefined) {
        const response = await getCollegeDataById(collegeId?.toString());
        if (response != undefined) {
          var college = response as College;
          college.id = collegeId.toString();
          setCollege(college);
        }
        return response;
      }
    }
    fetchData();
  }, [collegeId]);

  const isUserAdmin = (): boolean => {
    return user != null && college.admins.includes(user?.email!);
  };

  
  useEffect(() => {
    let unsubscribe;

    unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{user, loading, isUserAdmin, college}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;