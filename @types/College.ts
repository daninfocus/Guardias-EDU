import Teacher from "./Teacher";
class College {
  id?: string;
  name: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  admins: Array<string>;
  teachers: Array<string> | undefined;
  classes: string[];
  schedule: Array<Object>;

  constructor() {
    this.name = "Cargando...";
    this.admins = ["0"];
    this.classes = [];
    this.schedule = [];
  }
}

export default College;