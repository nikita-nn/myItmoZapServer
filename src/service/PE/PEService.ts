import { urlData } from "../../settings";
import { db } from "../../db/db";
import { and, eq } from "drizzle-orm";
import { UserLessons } from "../../db/schema/userLessonsSchema";
import {Worker} from "node:worker_threads";

export const signToLesson = async (taskId: string, accessToken: string) => {
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


export const startMonitoring = async (isu_id: string, task_id: string, task?: typeof UserLessons.$inferSelect) => {

  if(!task) {
    task = await db
        .insert(UserLessons)
        .values({ isu_id: isu_id, task_id: task_id, active: true })
        .returning()
        .then((task) => task[0]);

  }

  const worker = new Worker("./src/workers/peWorker.js");

  worker.postMessage({ isu_id, task_id });

  return async () => {
    worker.postMessage({ status: "terminate" });
    await db
        .update(UserLessons)
        .set({ active: false, closedAt: new Date() })
        .where(eq(UserLessons.id, Number(task?.id)));
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
