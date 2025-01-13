import { urlData } from "../../settings";
import { refreshAccessToken } from "../auth/authService";
import { db } from "../../db/db";
import { Users } from "../../db/schema/userSchema";
import { and, eq } from "drizzle-orm";
import { UserLessons } from "../../db/schema/userLessonsSchema";

const signToLesson = async (taskId: string, accessToken: string) => {
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

  return resData;
};

export const startMonitoring = async (
  user: typeof Users.$inferSelect,
  task_id: string,
) => {
  const newTask = await db
    .insert(UserLessons)
    .values({ isu_id: user.isu_id, task_id: task_id, active: true })
    .returning()
    .then((task) => task[0]);

  let accessToken = user.access_token;
  let isRunning = true;
  let isActive = true;

  const executeTask = async () => {
    if (!accessToken) {
      accessToken = await refreshAccessToken(user.isu_id);
    }

    const resData = await signToLesson(task_id, accessToken);

    switch (resData.error_code) {
      case 0:
        isRunning = false;
        break;
      case 92:
        accessToken = await refreshAccessToken(user.isu_id);
    }
  };

  const taskIntervalId = setInterval(async () => {
    if (!isRunning || !isActive) {
      clearInterval(taskIntervalId);
      return;
    }

    try {
      await executeTask();
    } catch (error) {
      console.error("Error during task execution:", error);
    }
  }, 1000);

  const activeCheckIntervalId = setInterval(async () => {
    const task = await db
      .select()
      .from(UserLessons)
      .where(eq(UserLessons.id, newTask.id))
      .then((tasks) => tasks[0]);

    if (!task || task.active === false) {
      await db
        .update(UserLessons)
        .set({ closedAt: new Date() })
        .where(eq(UserLessons.id, newTask.id));
      isActive = false;
      clearInterval(activeCheckIntervalId);
      clearInterval(taskIntervalId);
    }
  }, 5000);

  return () => {
    isRunning = false;
    isActive = false;
    clearInterval(taskIntervalId);
    clearInterval(activeCheckIntervalId);
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

  return lesson && lesson.filter((lesson) => lesson.active).length > 0;
};

export const checkUserLessonExistence = async (
  isu_id: string,
  task_id: string,
) => {
  const lesson = await db
    .select()
    .from(UserLessons)
    .where(
      and(eq(UserLessons.id, Number(task_id)), eq(UserLessons.isu_id, isu_id)),
    );
  return lesson.length > 0;
};
