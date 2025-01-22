type Semester = {
  semester: number;
  statusId: number;
  groupFlow: string;
  statusName: string;
};

export interface ElectionDiscipline {
  dcId: number;
  discId: number;
  langId: number;
  depName: string;
  discName: string;
  langCode: string;
  required: boolean;
  semesters: Semester[];
  description: string;
  depNameShort: string;
  notCompatibleWith: null | number[];
}

export interface OutputElectionDiscipline {
  name: string;
  discId: number;
  notCompatible: number[];
}