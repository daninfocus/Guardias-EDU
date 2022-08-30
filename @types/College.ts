import Teacher from "./Teacher";
class College {
  id?: string;
  name: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  admins: Array<string>;
  teachers: Array<Teacher> | undefined;
  classes: string[];

  constructor() {
    this.name = "Cargando...";
    this.admins = ["0"];
    this.classes = [];
  }
}

export default College;