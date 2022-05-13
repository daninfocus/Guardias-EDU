import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence, onAuthStateChanged, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
import firebase from './firebase';
import {User} from '@firebase/auth-types';
import { addDocument,saveUser } from "./firestore";

export const auth = getAuth(firebase);

export const currentUser = () => {
    return onAuthStateChanged(auth, (user) => {

    })
}

var provider = new GoogleAuthProvider();


//TODO set persistence not working 
export const signInWithGoogle = () => setPersistence(auth, browserSessionPersistence)
    .then(async () => {
        const res = await signInWithPopup(auth, provider);
        saveUser(res.user as User);
        return res.user;
    });


export const signInAnonymous = () => signInAnonymously(auth);

export const logOut = () => signOut(auth);