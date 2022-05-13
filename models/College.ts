import Teacher from "./Teacher";
export default interface College {
    id?: string,
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    uidAdmin: string;
    teachers:  Array<Teacher> | null
}