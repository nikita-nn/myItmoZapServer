import { db } from "../../db/db";
import { Nodes } from "../../db/schema/nodesSchema";
import { urlData } from "../../settings";
import { eq } from "drizzle-orm";
import { UserLessons } from "../../db/schema/userLessonsSchema";
import { startMonitoring } from "../PE/PEService";

const measurePing = async (url: string) => {
  try {
    const start = Date.now();
    await fetch(url);
    const end = Date.now();

    return end - start;
  } catch (error) {
    return 99999;
  }
};

export const healthCheck = async () => {
  const nodeDomain = String(process.env.NODE_URL);
  const nodeName = String(process.env.NODE_NAME);

  await db
    .insert(Nodes)
    .values({ name: nodeName, url: nodeDomain })
    .onConflictDoUpdate({
      target: Nodes.name,
      set: { url: nodeDomain, name: nodeName },
    });
  await checkNodePing();
};

export const checkNodePing = async () => {
  const nodeName = String(process.env.NODE_NAME);
  const ping = await measurePing(urlData.myItmo);
  await db.update(Nodes).set({ ping: ping }).where(eq(Nodes.name, nodeName));
};

export const restartActiveTasks = async () => {
  const lessonTasks = await db
    .select()
    .from(UserLessons)
    .where(eq(UserLessons.active, true));

  for (const lesson of lessonTasks) {
    await startMonitoring(String(lesson.isu_id), lesson.task_id, lesson);
  }
};
