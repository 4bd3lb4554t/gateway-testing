import redis from "../integration/redisClient";
import { hashPassword } from "./hashedPassword";
import { sendDataToQueue } from "../integration/rabbitmqClient";


async function generate6DigitCode(): Promise<string> 
{
  const value: string = Math.floor(100000 + Math.random() * 900000).toString();
  // return value;
  return "999999";
}


export async function sendVerificationEmail(data: any)
{
  const code: string = await generate6DigitCode();

  // if(data.password)
  data.password = await hashPassword(data.password);
  data["code"] = code;

  console.log("email" , data)
  await redis.set(data.email, JSON.stringify(data), "EX", "260");

  const info: object = { email: data.email, text: code };
  await sendDataToQueue(info, "emailhub");
}
