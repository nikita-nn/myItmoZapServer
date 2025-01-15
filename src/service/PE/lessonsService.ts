import { urlData } from "../../settings";
import { refreshAccessToken } from "../auth/authService";

export const getLessonsData = async (isu_id: string) => {
  const accessToken = await refreshAccessToken(isu_id);
  try {
    const res = await fetch(urlData.lessonsData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await res.json();

    return json.result;
  } catch (e) {
    return false;
  }
};

export const getLessonsFullData = async (
  isu_id: string,
  building_id: number,
  date_start: string,
) => {
  const accessToken = await refreshAccessToken(isu_id);
  try {
    const res = await fetch(
      `${urlData.fullLessonsData}?building_id=${building_id}&date_start=${date_start}&date_end=${date_start}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    ); // MyITMO bug - filters on platform don't work correctly
    const json = await res.json();
    return json.result;
  } catch (e) {
    return false;
  }
};
