import Teacher from "./Teacher";
class College {
    id?: string;
    name: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    uidAdmin: string;
    teachers:  Array<Teacher> | undefined

    constructor() {
        this.name = "Cargando...";
        this.uidAdmin = "0";
      }
}

export default College;