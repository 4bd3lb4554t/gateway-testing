import {FastifyReply } from "fastify";
import app from "../app";



export async function setJwtTokens(res: FastifyReply, user: any | null) 
{


  const accessToken = await app.jwt.sign({ userId: user.id }, { expiresIn: "1h" });
  const refreshToken = await app.jwt.sign({ userId: user.id }, { expiresIn: "7d" });

  res.setCookie("accessToken", accessToken, { httpOnly: true, path: "/" });
  res.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}
























