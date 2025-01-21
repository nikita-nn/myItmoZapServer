import { refreshAccessToken } from "../auth/authService";
import { urlData } from "../../settings";

export const getAvailableDisciplines = async (isu_id: string) => {
  const accessToken = await refreshAccessToken(isu_id);
  const res = await fetch(urlData.electionGetDisciplines, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    return false;
  }
  const json = await res.json();
  return json.result.map((disc: { discName: string; discId: number }) => {
    return { name: disc.discName, discId: disc.discId };
  });
};
