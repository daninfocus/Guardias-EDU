import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence, signInAnonymously, signInWithPopup, signOut, getRedirectResult } from 'firebase/auth';
import firebase from './firebase';
import {User} from '@firebase/auth-types';
import { saveUser } from "./firestore";

export const auth = getAuth(firebase);

var provider = new GoogleAuthProvider();

export const signInWithGoogle = () => setPersistence(auth, browserSessionPersistence)
    .then(async () => {
        // signInWithRedirect(auth, provider);
        // const userCred = await getRedirectResult(auth)
        // console.log(userCred)
        // if(userCred){
        //     return userCred.user;
        // }else{
            const userCred = await signInWithPopup(auth, new GoogleAuthProvider())
            if(userCred && userCred.user.email?.includes("@fernando3martos.com") || userCred.user.email==='danielwebb0099@gmail.com'){
                saveUser(userCred.user as User);
                return userCred.user;
            }else{
                return null;
            }
        // }
    });


export const signInAnonymous = () => signInAnonymously(auth);

export const logOut = () => signOut(auth);