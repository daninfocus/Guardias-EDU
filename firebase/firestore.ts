import firebase from './firebase';
import { User } from '@firebase/auth-types';
import { addDoc, Timestamp, collection, doc, getDoc, getDocs, deleteDoc, getFirestore, limit, orderBy, query, queryEqual, arrayUnion, startAfter, startAt, updateDoc, where, arrayRemove, onSnapshot } from 'firebase/firestore';
import Guardia from '../@types/Guardia';
import College from '../@types/College';
import Teacher from '../@types/Teacher';


interface GetGuardiasParams {
    week: Date[];
    setLoadingGuardias: (loading: boolean) => void;
    setGuardias: (guardias: Guardia[]) => void;
    collegeId: string | null;
    loadingGuardias: boolean;
    showGuardiaForm: boolean;
}

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
            email: user.email,
            photo: user.photoURL,
            status: "Registered"
        });
    }else{
        let ref = docs.docs[0].ref;

        await updateDoc(ref, {
            status: "Logged-in"
        });
    }
    return user;
}

export const doesUserHaveCollegeAssigned = async (email: string) => {
    const q = query(collection(firestore, "colleges"), where("teachers", "array-contains", email), limit(1));
    const docs = await getDocs(q);
    return docs.docs[0];
}

export const getColleges = async () => {
    const q = await getDocs(collection(firestore, "colleges"));
    var collegeNames: any = [];
    q.forEach((doc: any) => {
        var college = doc.data();
        college.id = doc.id;
        collegeNames.push(college as College)
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
    if (college != undefined) {
        // for (const teacherDocId of college.teachers!) {
        //     var teacherObject = await getTeacherById(teacherDocId.toString()) as Teacher;
        //     console.log(teacherObject)
        //     teachers.push(teacherObject);
        // }
        // college.teachers = teachers;
        return college;
    }
}

export const teacherRef = async (email: string)=>{
    const q = query(collection(firestore, "users"), where("email", "==", email));
    const docSnap = await getDocs(q);
    return docSnap;
}

export const getTeacherById = async (id: string) => {
    
    if(id){
        const ref = await doc(firestore, "users",id)
        const docSnap = await getDoc(ref);
        // let docSnap = await teacherRef(email);   
        let teacher = null;

        if (docSnap) {
            
            teacher = docSnap.data()
            return teacher;
            
        }
        
    }else{
        return {
            status: "Waiting",
            email: 'Loading',
            photo: "/no_user.png"
        };
    }
}

export const deleteTeacherFromCollege = async (collegeId: string, email: string) => {

    const ref = await doc(firestore, 'colleges', collegeId);
    const docSnap = await getDoc(ref);

    updateTeacherArray(collegeId,email);

    if (ref != null) {
        await updateDoc(ref, {
            teachers: arrayRemove(email)
        });
    }
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const addAdmin = async (collegeId: string, email: string) => {
    const ref = await getCollegeById(collegeId);
    const docSnap = await getDoc(ref);

    if (ref != null) {
        await updateDoc(ref, {
            admins: arrayUnion(email)
        });
    }
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}


export const updateTeacherArray = async (collegeId: string, email: string) => {
    const ref = await getCollegeById(collegeId);
    const docSnap = await getDoc(ref);

    let teacherObject = await teacherRef(email);
    
    if(teacherObject.docs.length>0){
        await updateDoc(teacherObject.docs[0].ref, {
            status: "Baja"
        }); 
    }

    if (ref != null) {
        await updateDoc(ref, {
            teachers: arrayUnion(email)
        });
    }
    if (docSnap.exists()) {
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


export const updateTimeSlotsForCollege = async (collegeId: string, schedule: Array<Object>) => {
    const ref = await getCollegeById(collegeId);
    const docSnap = await getDoc(ref);

    if (ref != null) {
        await updateDoc(ref, {
            schedule: schedule
        });
    }
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}



export const getGuardias = async (week: Date[], collegeId: string | string[]): Promise<Guardia[]> => {

    try {
        const [firstDay, lastDay] = [week[0], week[week.length - 1]].map(d => new Date(d));
        firstDay.setHours(0,0,0)
        lastDay.setHours(11,59,59)
        
        const q = query(collection(firestore, "guardias")
            ,where('collegeId', '==', collegeId)
            ,where('dayOfGuardia', '>=', firstDay)
            ,where('dayOfGuardia', '<=', lastDay));

        const docSnap = await getDocs(q);

        const guardiaArray: Guardia[] = docSnap.docs.map(doc => {
            const guardia = doc.data()
            guardia.dayOfGuardia = guardia.dayOfGuardia.toDate();
            // Optionally, fetch teacher details here if needed
            return guardia as Guardia;
        });

        localStorage.setItem('guardiaResponse', JSON.stringify(guardiaArray));

        return guardiaArray

    } catch (error) {
        console.error('Error fetching guardias: ', error);
        return []
    }

    
};


export const deleteGuardia = async (guardia: Guardia) => {
    await deleteDoc(doc(firestore, "guardias", guardia.id!));
}


export const updateGuardia = async (guardia: Guardia) => {
    const ref = doc(firestore, "guardias", guardia.id!);
    console.log(ref)
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


export const getNoLoginUrl = async (collegeId: Number) => {
    
    const q = query(collection(firestore, "no-login-url"), where("collegeId", "==", collegeId));
    const docSnap = await getDocs(q);

   
    return docSnap.docs;
}

export const getNoLoginUrlByUrl = async (url: String) => {
    
    const q = query(collection(firestore, "no-login-url"), where("url", "==", url));
    const docSnap = await getDocs(q);
    return docSnap.docs;
}
