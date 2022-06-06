import Teacher from "./Teacher";
import College from "./College";

export default interface Guardia {
    id?: string,
    createdAt: Date;
    updatedAt: Date | null;
    teacherId: string;
    teacherName: string;
    collegeId: string;
    tasks: string;
    moreInfo: string;
    classroom: string;
    hour: number;
    dayOfGuardia: Date;
    isEmpty: boolean;
    color: number;
}