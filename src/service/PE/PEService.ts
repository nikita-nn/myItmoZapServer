import { urlData } from "../../settings";
import { refreshAccessToken } from "../auth/authService";
import { db } from "../../db/db";
import { Users } from "../../db/schema/userSchema";
import { and, eq } from "drizzle-orm";
import { UserLessons } from "../../db/schema/userLessonsSchema";

const signToLesson = async (
  taskId: string,
  accessToken: string,
  isu_id: string,
) => {
  const response = await fetch(urlData.signUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: `[${taskId}]`,
  });

  const resData = await response.json();
  console.log(resData, response.status);

  if (resData.error_code == 92) {
    await refreshAccessToken(isu_id);
  }

  return response.status == 200;
};

export const startMonitoring = async (isu_id: string, task_id: string) => {
  let user = await db
    .select()
    .from(Users)
    .where(eq(Users.isu_id, isu_id))
    .then((users) => users[0]);

  const newTask = await db
    .insert(UserLessons)
    .values({ isu_id: isu_id, task_id: task_id })
    .returning()
    .then((task) => task[0]);

  let accessToken = user.access_token;
  let isRunning = true;

  const executeTask = async () => {
    if (!accessToken) {
      accessToken = await refreshAccessToken(isu_id);
    }

    const success = await signToLesson(task_id, accessToken, isu_id);

    if (success) {
      isRunning = false;
    }
  };

  const intervalId = setInterval(async () => {
    if (isRunning) {
      try {
        await executeTask();
      } catch (error) {
        console.error("Error during task execution:", error);
      }
    } else {
      await db
        .update(UserLessons)
        .set({ closedAt: new Date(), active: false })
        .where(eq(UserLessons.id, newTask.id));
      clearInterval(intervalId);
    }
  }, 1000);

  return () => {
    isRunning = false;
    clearInterval(intervalId);
  };
};

export const checkExistingLesson = async (
  lesson_id: string,
  isu_id: string,
) => {
  const lesson = await db
    .select()
    .from(UserLessons)
    .where(
      and(eq(UserLessons.isu_id, isu_id), eq(UserLessons.task_id, lesson_id)),
    );
  return lesson.length > 0;
};
