import Teacher from "./Teacher";
class College {
  id?: string;
  name: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  uidAdmin: string;
  teachers: Array<String> | undefined;
  classes: string[];

  constructor() {
    this.name = "Cargando...";
    this.uidAdmin = "0";
    this.classes = [];
  }
}

export default College;