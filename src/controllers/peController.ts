import { Request, Response } from "express";
import { buildRes } from "../service/system/buildRes";
import { checkExistingLesson, startMonitoring } from "../service/PE/PEService";
import { db } from "../db/db";
import { UserLessons } from "../db/schema/userLessonsSchema";
import { eq } from "drizzle-orm";

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

  await startMonitoring(req.user.isu_id, lesson_id);
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
