import { urlData } from "../../settings";
import { refreshAccessToken } from "../auth/authService";
import { db } from "../../db/db";
import { and, eq } from "drizzle-orm";
import { UserLessons } from "../../db/schema/userLessonsSchema";
import {
  checkTelegramLinkStatus,
  sendMessageToTG,
} from "../user/telegramService";

const signToLesson = async (taskId: string, accessToken: string) => {
  const response = await fetch(urlData.signUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: `[${taskId}]`,
  });

  return await response.json();
};

export const startMonitoring = async (isu_id: string, task_id: string) => {
  const newTask = await db
    .insert(UserLessons)
    .values({ isu_id: isu_id, task_id: task_id, active: true })
    .returning()
    .then((task) => task[0]);
  const canSendMessageData = await checkTelegramLinkStatus(isu_id);

  let accessToken = await refreshAccessToken(isu_id);
  let isRunning = true;
  let isActive = true;

  const executeTask = async () => {
    if (!accessToken) {
      accessToken = await refreshAccessToken(isu_id);
    }

    const resData = await signToLesson(task_id, accessToken);
    switch (resData.error_code) {
      case 0:
        isRunning = false;
        break;
      case 92:
        accessToken = await refreshAccessToken(isu_id);
    }
  };

  const taskIntervalId = setInterval(async () => {
    if (!isRunning || !isActive) {
      clearInterval(taskIntervalId);
      if (canSendMessageData) {
        await sendMessageToTG(isu_id, `Successfully finished ${task_id}`);
      }
      await db
        .update(UserLessons)
        .set({
          active: false,
          closedAt: new Date(),
        })
        .where(
          and(eq(UserLessons.isu_id, isu_id), eq(UserLessons.task_id, task_id)),
        );
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

  return async () => {
    if (canSendMessageData) {
      await sendMessageToTG(isu_id, `Successfully finished ${task_id}`);
    }
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
  const userLessons = await db
    .select()
    .from(UserLessons)
    .where(
      and(
        eq(UserLessons.isu_id, isu_id),
        eq(UserLessons.task_id, lesson_id),
        eq(UserLessons.active, true),
      ),
    );

  return userLessons.length > 0;
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
