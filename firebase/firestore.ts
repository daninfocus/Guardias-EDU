import firebase from './firebase';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, queryEqual, arrayUnion, startAfter, startAt, updateDoc, where } from 'firebase/firestore';

const firestore = getFirestore(firebase);

export const addDocument = async <T>(collectionName: string, data: T) => {
    const { id } = await addDoc(collection(firestore, collectionName), data);
    return id;
}

export const saveUser = async <T>(user: T) => {
    const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
        return await addDoc(collection(firestore, "users"), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
        });
    }
    return user;
}

export const doesUserHaveCollegeAssigned = async (uid: string) => {
    const q = query(collection(firestore, "colleges"), where("teachers", "array-contains", uid), limit(1));
    const docs = await getDocs(q);
    return docs.docs[0];
}

export const getColleges = async () => {
    const q = await getDocs(collection(firestore, "colleges"));
    var collegeNames: any = [];
    q.forEach((doc: any) => {
        collegeNames.push({ 'id': doc.id, 'name': doc.data().name })
    });
    return collegeNames;
}

export const getCollegeById = async (collegeId: string) => {
    console.log('COLLEG ISD')
    console.log(collegeId);
    const ref = await doc(firestore, "colleges", collegeId);
    return ref;
}


export const getCollegeDataById = async (collegeId: string) => {
    const ref = doc(firestore, "colleges", collegeId);
    const docSnap = await getDoc(ref);
    return docSnap.data();
}

export const updateTeacherArray = async (collegeId: string, teacherid: string) => {
    console.log(collegeId);
    const ref = await getCollegeById(collegeId);
    console.log('yoyoy');
    if (ref != null) {
        console.log('in here');
        //add teachers to array
        await updateDoc(ref, {
            teachers: arrayUnion(teacherid)
        });
        console.log('no here');
    }
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
        // Convert to object
        const college = docSnap.data();
        return college;
    } else {
        return null;
    }
}

