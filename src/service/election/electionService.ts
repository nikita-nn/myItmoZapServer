import { refreshAccessToken } from "../auth/authService";
import { urlData } from "../../settings";
import {ElectionDiscipline, OutputElectionDiscipline} from "../../types/electionTypes";

export const getAvailableDisciplines = async (isu_id: string) => {
  const accessToken = await refreshAccessToken(isu_id);
  const res = await fetch(urlData.electionGetDisciplines, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return {required: [], notRequired: []};
  }

  const json = await res.json();
  return prepareElectionData(json.result);
};

const prepareElectionData = (data: ElectionDiscipline[]) => {

  const finArr: Record<string, OutputElectionDiscipline[]> = {required: [], notRequired: []}

  data.filter((disc: ElectionDiscipline) => disc.semesters[0].statusId === 1).forEach((disc: ElectionDiscipline) => {
    const dataElem = {
      name: disc.discName,
      discId: disc.discId,
      required: disc.required,
      notCompatible: disc.notCompatibleWith ? disc.notCompatibleWith : [],
    }
    if(disc.required){
      finArr["required"].push(dataElem)
    }else{
      finArr["notRequired"].push(dataElem)
    }
  })
  return finArr
}



export const checkCompatibilityOfDisciplines = async (isu_id: string, disciplines: number[]) => {
  const allDisciplines = await getAvailableDisciplines(isu_id);
  const allDisciplinesArray = [...allDisciplines.required, ...allDisciplines.notRequired];

  for (const requiredDisc of allDisciplines.required) {
    if (!disciplines.includes(requiredDisc.discId)) {
      return false;
    }
  }

  for (const disc of disciplines) {
    const selectedDisc = allDisciplinesArray.find((d) => d.discId === disc);

    if (!selectedDisc) {
      return false
    }

    for (const incompatibleDisc of selectedDisc.notCompatible) {
      if (disciplines.includes(incompatibleDisc)) {
        return false;
      }
    }
  }

  return true;
};


export const sendRequestToElectionOrder = async (isu_id: string) =>{
  const accessToken = await refreshAccessToken(isu_id)
  const res = await fetch(urlData.orderElection, { headers: { Authorization: `Bearer ${accessToken}` } })

  const json = await res.json();



}