import {db} from "../../db/db";
import {Users} from "../../db/schema/userSchema";
import {eq} from "drizzle-orm";


export const checkTelegramLinkStatus = async (isu_id: string) => {
    const user = await db.select().from(Users).where(eq(Users.isu_id, isu_id)).then((users)=> users[0])

    if(user && user.botToken && user.tgAccountId){
        return {token: user.botToken, telegramId: user.tgAccountId}
    }else{
        return null
    }
}



export const sendMessageToTG = async (isu_id: string, text: string) =>{
    const telegramLink = await checkTelegramLinkStatus(isu_id)

    if(!telegramLink){
        return false
    }

    const url = `https://api.telegram.org/bot${telegramLink.token}/sendMessage`;
    const params = {
        chat_id: telegramLink.telegramId,
        text: text
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params)
    });

    const json = await res.json()
    console.log(json)
    return true
}

