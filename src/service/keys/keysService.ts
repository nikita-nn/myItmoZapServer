import { db } from "../../db/db";
import { Keys } from "../../db/schema/keysSchema";

const generateKey = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=";
  const charactersLength = characters.length;
  let result = "MYITMO-KEY-";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result + "-KEY-END";
};

export const generateKeys = async (keysNum: number) => {
  for (let i = 0; i < keysNum; i++) {
    const key = generateKey(16);
    await db.insert(Keys).values({ key: key });
  }
  console.log(`generated ${keysNum} keys`);
};
