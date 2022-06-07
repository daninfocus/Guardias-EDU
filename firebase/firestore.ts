import firebase from './firebase';
import { User } from '@firebase/auth-types';
import { addDoc, Timestamp, collection, doc, getDoc, getDocs, deleteDoc, getFirestore, limit, orderBy, query, queryEqual, arrayUnion, startAfter, startAt, updateDoc, where, arrayRemove } from 'firebase/firestore';
import Guardia from '../@types/Guardia';
import College from '../@types/College';
import Teacher from '../@types/Teacher';

const firestore = getFirestore(firebase);

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
    college.teachers?.map(async (item) => {
        var teacher = await getTeacherById(item.toString());
        teacher.id = item;
        teachers.push(teacher as Teacher);
    });
    college.teachers = teachers;
    return college;
}

const getTeacherById = async (teacherId: string) => {
    const q = query(collection(firestore, "users"), where("uid", "==", teacherId));
    const docs = await getDocs(q);
    return docs.docs[0].data();
}

export const deleteTeacherFromCollege = async (collegeId: string, teacherId: string) => {

    const ref = doc(firestore, 'colleges', collegeId);
    const docSnap = await getDoc(ref);
    await updateDoc(ref, {
        teachers: arrayRemove(teacherId)
    });

    return docSnap.data();
};


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

export const getGuardias = async (collegeId: string) => {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstday = new Date(curr.setDate(first))
    var lastday = new Date(curr.setDate(last))
    firstday.setHours(0, 0, 0, 0);
    lastday.setHours(0, 0, 0, 0);
    const q = query(collection(firestore, "guardias"), where('collegeId', '==', collegeId));
    const docs = await getDocs(q);
    var guardiaArray: Array<Guardia> = [];
    for (const element of docs.docs) {

        var guardia = element.data();
        var guardiaDate = guardia.dayOfGuardia.toDate();
        guardia.teacher = await getTeacherById(guardia.teacherId);
        guardia.teacher.id = guardia.teacherId;
        delete guardia.teacherId;
        delete guardia.teacherName;
        guardia.id = element.id;
        guardia.dayOfGuardia = guardiaDate;
        guardiaArray.push(guardia as Guardia);
    };
    return guardiaArray;
}

export const updateClassesForCollege = async (collegeId: string, className: Array<string>) => {
    const ref = await getCollegeById(collegeId);
    const docSnap = await getDoc(ref);

    if (ref != null) {
        //add teachers to array
        await updateDoc(ref, {
            classes: className
        });
    }
    if (docSnap.exists()) {
        // Convert to object
        return docSnap.data();
    }
    return null;
}

export const getProfilePhotoWithTeacherid = async (teacherId: string) => {
    const q = query(collection(firestore, "users",), where("uid", "==", teacherId));
    const docs = await getDocs(q);
    return docs.docs[0].data().photo;
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