import { urlData } from "../../settings";
import {refreshAccessToken} from "../auth/authService";

export const signToLesson = async (taskId: number, accessToken: string, isu_id: string) => {
  const response = await fetch(urlData.signUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: `[${taskId}]`,
  });
  const resData = await response.json();

  if(resData.error_code == 92){
    await refreshAccessToken(isu_id)
  }

  return response.status == 200
};


