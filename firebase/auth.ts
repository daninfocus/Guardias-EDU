import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
import firebase from './firebase';
import {User} from '@firebase/auth-types';
import { saveUser } from "./firestore";

export const auth = getAuth(firebase);

var provider = new GoogleAuthProvider();

export const signInWithGoogle = () => setPersistence(auth, browserSessionPersistence)
    .then(async () => {
        const res = await signInWithPopup(auth, provider);
        saveUser(res.user as User);
        return res.user;
    });


export const signInAnonymous = () => signInAnonymously(auth);

export const logOut = () => signOut(auth);