import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../db/database';
import redis from '../integration/redisClient';
import QRCode from "qrcode";

import { authenticator } from "otplib";


export async function sendEmailVerificationHandler(req: FastifyRequest, res: FastifyReply) 
{
  return res.send({msg : true})
}


export async function verifyEmailCodeHandler(req: FastifyRequest, res: FastifyReply) 
{
  const body = req.body as any;
  const id = req.id as any;
  const user:any = await prisma.user.findUnique({where : {id : Number(id)}})
  const code = await redis.get(`2fa:${user.email}`);

  if(code != body.code)
    return res.status(400).send({msg : false})

  await prisma.twofactorauth.create({data : {userId : Number(id) , method : 'email'  , enabled : true}})

  return res.status(200).send({msg : true})
}






export async function setupAuthenticatorHandler(req: FastifyRequest, res: FastifyReply) 
{
  try 
  {
    const user = await prisma.user.findUnique({where : {id : Number(req.id)}})
    if(!user)
      throw new Error("user not found")
  
    const secret = authenticator.generateSecret();
    const serviceName = "ft_trandandan";
    
    const otpauth = authenticator.keyuri(user.username, serviceName, secret);
    
    const key = otpauth.split('=')[1].split('&')[0]
    const url  = await QRCode.toDataURL(otpauth);

    await prisma.twofactorauth.upsert({ where: { userId: user.id }, 
      update: { secret: secret,},
      create: { userId: user.id, method: 'totp', secret: secret, enabled: true,},
    });
    
    
    return res.send({url , key})
  } 
  catch {}

  return res.status(400).send({msg : false})
}


export async function verifyAuthenticatorCodeHandler(req: FastifyRequest, res: FastifyReply) 
{
  const body = req.body as any;
  const id = req.id as any;

  try 
  {
    const twoFA = await prisma.twofactorauth.findUnique({ where: { userId: Number(id) } });

    if (!twoFA || !twoFA.secret) 
      throw new Error('2FA secret not found');

    const isValid = authenticator.check(body.code, twoFA.secret);

    if (!isValid)
      throw new Error('Invalid code');

    return res.send({ msg: true });
  } 
  catch 
  {
    return res.status(400).send({ msg: false });
  }
}

export async function disable2FAHandler(req: FastifyRequest, res: FastifyReply) 
{
  return res.send({msg : true})
}