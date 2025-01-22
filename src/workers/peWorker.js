import {parentPort} from "node:worker_threads";
import {checkTelegramLinkStatus, sendMessageToTG} from "../service/user/telegramService";
import {refreshAccessToken} from "../service/auth/authService";
import {signToLesson} from "../service/PE/PEService";
import {db} from "../db/db";
import {UserLessons} from "../db/schema/userLessonsSchema";
import {and, eq} from "drizzle-orm";

parentPort.on("message", async ({ isu_id, task_id }) => {
    let accessToken = await refreshAccessToken(isu_id);
    let isRunning = true;
    let isActive = true;

    const executeTask = async () => {
        if (!accessToken) {
            accessToken = await refreshAccessToken(isu_id);
        }

        const resData = await signToLesson(task_id, accessToken);
        console.log(resData);
        if (resData.error_code === 0) {
            isRunning = false;
        } else if (resData.error_code === 92) {
            accessToken = await refreshAccessToken(isu_id);
        }
    };

    const canSendMessageData = await checkTelegramLinkStatus(isu_id);

    const intervalId = setInterval(async () => {
        if (!isRunning || !isActive) {
            clearInterval(intervalId);

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
                    and(eq(UserLessons.isu_id, isu_id), eq(UserLessons.task_id, task_id))
                );

            parentPort.postMessage({ status: "done" });
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
            .where(eq(UserLessons.task_id, task_id))
            .then((tasks) => tasks[0]);

        if (!task || task.active === false) {
            await db
                .update(UserLessons)
                .set({ closedAt: new Date() })
                .where(eq(UserLessons.task_id, task_id));

            isActive = false;
            clearInterval(activeCheckIntervalId);
            clearInterval(intervalId);
        }
    }, 5000);
});
