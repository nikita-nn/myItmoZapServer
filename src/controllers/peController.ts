import { Request, Response } from "express";
import { buildRes } from "../service/system/buildRes";
import {
  checkExistingLesson,
  checkUserLessonExistence,
  startMonitoring,
} from "../service/PE/PEService";
import { db } from "../db/db";
import { UserLessons } from "../db/schema/userLessonsSchema";
import { and, eq } from "drizzle-orm";

export const signLessonController = async (req: Request, res: Response) => {
  const { lesson_id } = req.body;

  if (!lesson_id) {
    return buildRes(400, "No task id specified", res);
  }

  const checkExistingLessonResult = await checkExistingLesson(
    lesson_id,
    req.user.isu_id,
  );

  if (checkExistingLessonResult) {
    return buildRes(
      400,
      "You cant start monitoring on single lesson twice",
      res,
    );
  }

  await startMonitoring(req.user, lesson_id);

  return buildRes(
    200,
    `Successfully started monitoring on ${lesson_id} lesson`,
    res,
  );
};

export const getAllUserLessonsController = async (
  req: Request,
  res: Response,
) => {
  const allUserLessons = await db
    .select()
    .from(UserLessons)
    .where(eq(UserLessons.isu_id, req.user.isu_id))
    .then((lessons) => lessons.filter((lesson) => lesson.active));
  return buildRes(200, allUserLessons, res);
};

export const stopLessonMonitoringController = async (
  req: Request,
  res: Response,
) => {
  const { task_id } = req.body;

  if (!task_id) {
    return buildRes(400, "No task id specified", res);
  }

  const validationTaskData = await checkUserLessonExistence(
    req.user.isu_id,
    task_id,
  );

  if (!validationTaskData) {
    return buildRes(400, "Not task in db or not your task ", res);
  }

  await db
    .update(UserLessons)
    .set({ active: false })
    .where(
      and(
        eq(UserLessons.isu_id, req.user.isu_id),
        eq(UserLessons.id, Number(task_id)),
      ),
    );
  return buildRes(200, `Successfully stopped monitoring ${task_id}`, res);
};
