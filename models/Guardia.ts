import Teacher from "./Teacher";
import College from "./College";

export default interface Guardia {
    id?: string,
    createdAt: Date;
    updatedAt: Date | null;
    teacher: Teacher;
    college:  College;
}