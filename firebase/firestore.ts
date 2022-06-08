import firebase from './firebase';
import { User } from '@firebase/auth-types';
import { addDoc, Timestamp, collection, doc, getDoc, getDocs, deleteDoc, getFirestore, limit, orderBy, query, queryEqual, arrayUnion, startAfter, startAt, updateDoc, where, arrayRemove, onSnapshot } from 'firebase/firestore';
import Guardia from '../@types/Guardia';
import College from '../@types/College';
import Teacher from '../@types/Teacher';

export const firestore = getFirestore(firebase);

export const addDocument = async <T>(collectionName: string, data: T) => {
    const { id } = await addDoc(collection(firestore, collectionName), data);
    return id;
}

export const saveUser = async (user: User) => {
    const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
        return await addDoc(collection(firestore, "users"), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
            photo: user.photoURL,

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
    const ref = await doc(firestore, "colleges", collegeId);
    return ref;
}

export const getCollegeDataById = async (collegeId: string) => {
    const ref = doc(firestore, "colleges", collegeId);

    var docSnap = await getDoc(ref);
    var college = docSnap.data() as College;

    var teachers: Array<Teacher> = [];
    for (const teacher in college.teachers) {
        var teacherObject = await getTeacherById(teacher) as Teacher;
        teacherObject.id = teacher;
        teachers.push(teacherObject);
    }
    college.teachers = teachers;
    return college;
}

export const getTeacherById = async (teacherId: string) => {

    const q = query(collection(firestore, "users"), where("uid", "==", teacherId));
    const docSnap = await getDocs(q);
    var teacher = null;
    docSnap.forEach((doc) => {
        teacher = doc.data()
    });
    if (teacher != null) {
        return teacher;
    } else {
        return {
            name: "Borrado",
            email: "Borrado",
            photo: "/no_user.png"
        };
    }
}

export const deleteTeacherFromCollege = async (collegeId: string, teacherId: string) => {

    const ref = doc(firestore, 'colleges', collegeId);
    const docSnap = await getDoc(ref);
    if (ref != null) {
        await updateDoc(ref, {
            teachers: arrayRemove(teacherId)
        });
    }
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const addAdmin = async (collegeId: string, teacherId: string) => {
    const ref = await getCollegeById(collegeId);
    const docSnap = await getDoc(ref);

    if (ref != null) {
        await updateDoc(ref, {
            uidAdmins: arrayUnion(teacherId)
        });
    }
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}


export const updateTeacherArray = async (collegeId: string, teacherid: string) => {
    const ref = await getCollegeById(collegeId);
    const docSnap = await getDoc(ref);

    if (ref != null) {
        //add teachers to array
        await updateDoc(ref, {
            teachers: arrayUnion(teacherid)
        });
    }
    if (docSnap.exists()) {
        // Convert to object
        return docSnap.data();
    }
    return null;
}


export const updateClassesForCollege = async (collegeId: string, className: Array<string>) => {
    const ref = await getCollegeById(collegeId);
    const docSnap = await getDoc(ref);

    if (ref != null) {
        await updateDoc(ref, {
            classes: className
        });
    }
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}

export const deleteGuardia = async (guardia: Guardia) => {
    await deleteDoc(doc(firestore, "guardias", guardia.id!));
}


export const editGuardia = async (guardia: Guardia) => {
    const ref = doc(firestore, "guardias", guardia.id!);
    var data = await updateDoc(ref, {
        updatedAt: new Date(),
        tasks: guardia.tasks,
        moreInfo: guardia.moreInfo,
        classroom: guardia.classroom,
        hour: guardia.hour,
        dayOfGuardia: guardia.dayOfGuardia,
        color: guardia.color
    });
    return data;
}