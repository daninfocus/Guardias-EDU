import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
import firebase from './firebase';
import {User} from '@firebase/auth-types';
import { saveUser } from "./firestore";

export const auth = getAuth(firebase);

var provider = new GoogleAuthProvider();

export const signInWithGoogle = () => setPersistence(auth, browserSessionPersistence)
    .then(async () => {
        const res = await signInWithPopup(auth, provider);
        if(res.user.email?.includes("@fernando3martos.com") || res.user.email==='danielwebb0099@gmail.com'){
            saveUser(res.user as User);
            return res.user;
        }else{
            logOut();
            return null;
        }
    });


export const signInAnonymous = () => signInAnonymously(auth);

export const logOut = () => signOut(auth);