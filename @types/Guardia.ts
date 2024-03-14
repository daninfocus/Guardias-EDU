import Teacher from "./Teacher";
import College from "./College";
import { JSONContent } from "@tiptap/react";

export default interface Guardia {
    id?: string,
    createdAt: Date;
    updatedAt: Date | null;
    teacher: Teacher | null;
    teacherDocId: string | null;
    teacherEmail: string | null;
    collegeId: string;
    tasks: JSONContent | undefined;
    moreInfo: string | null;
    classroom: string;
    hour: number;
    dayOfGuardia: Date;
    isEmpty: boolean;
    color: number;
}