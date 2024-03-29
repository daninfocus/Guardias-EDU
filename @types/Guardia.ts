import Teacher from "./Teacher";
import College from "./College";

export default interface Guardia {
    id?: string,
    createdAt: Date;
    updatedAt: Date | null;
    teacher: Teacher | null;
    teacherDocId: string | null;
    teacherEmail: string | null;
    collegeId: string;
    tasks: string;
    moreInfo: string | null;
    classroom: string;
    hour: number;
    dayOfGuardia: Date;
    isEmpty: boolean;
    color: number;
}