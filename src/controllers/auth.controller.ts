import { FastifyRequest, FastifyReply } from 'fastify';
import { hashPassword , VerifyPassword } from '../utils/hashedPassword';
import { sendVerificationEmail } from '../utils/verification_messenger';
import { sendToService } from '../integration/api_calls';
import { OAuth2Namespace } from '@fastify/oauth2';
import { setJwtTokens } from '../validators/2faValidator';
import { isUserVerified , isUserAlreadyRegistered  , isUserAllowedToLogin} from '../validators/userStatusCheck';
import { createAccount } from '../utils/utils';

import redis from '../integration/redisClient';
import prisma from '../db/database';


import app from '../app';
import { authRoutes } from '../routes/auth';
import { errorHandler } from '../utils/errorHandler';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}





export async function getRootHandler(req:FastifyRequest , res:FastifyReply)
{
    return res.type('text/html').sendFile('index.html')
}


export async function postSignupHandler(req:FastifyRequest , res:FastifyReply)
{
    const body = req.body as any;
    console.log(body)
    try
    {
      await isUserAlreadyRegistered(body);
      await sendVerificationEmail(body);
    }
    catch (error) 
    {
      if (error instanceof Error)
        return res.status(400).send({message : error.message})
    }
  return res.send({msg : true})
}



export async function verifyEmailHandler(req:FastifyRequest , res:FastifyReply)
{
    const body = req.body as any;

    try 
    {
      await isUserVerified(body);
      const data = await redis.get(body.email);

      { // change him later

        if(!data)
          throw new Error("s")
      }

      const parsed = JSON.parse(data);
      await createAccount(parsed);
    }
    catch (error) 
    {
      if (error instanceof Error)
        return res.status(400).send({message : error.message})
    }

  return res.send({msg : true})
}






export async function postLoginHandler(req:FastifyRequest , res:FastifyReply)
{
    const body = req.body as any;

    try 
    {
      const user = await prisma.user.findUnique({ where: { email: body.email}})
      await isUserAllowedToLogin(body , user);
      await setJwtTokens(res , user);
  
    }
    catch (error) 
    {
      if (error instanceof Error)
        return res.status(400).send({message : error.message})
    }

  return res.send({msg : true})
}





export async function postLogoutHandler(req:FastifyRequest , res:FastifyReply)
{

  res.clearCookie('accessToken', { path : '/' , httpOnly: true });
  res.clearCookie('refreshToken', { path : '/' , httpOnly: true });

  return res.send({msg : true})
}







export async function getGooglehandler(req:FastifyRequest , res:FastifyReply) 
{
    try 
    {
    const tokengoogle:any = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
    const result = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokengoogle.token.access_token}` } });
    const data = await result.json();


    data['avatar'] = data.picture
    data['username'] = data.email.split('@')[0];
    // console.log(data);
    const user = await createAccount(data);
    await setJwtTokens(res , user);

    }
    catch (error) 
    {
      return res.status(400).send({msg : false})
    }

  return res.redirect('/profile')
}




export async function getIntraUserhandler(req:FastifyRequest , res:FastifyReply) 
{
  const {code} = req.query as any;

  const body:object = {
      grant_type: 'authorization_code',
      client_id: process.env.IDINTRA,
      client_secret: process.env.SECRETINTRA,
      code: code,
      redirect_uri: 'http://localhost:4000/auth/intra/callback',
    }

  const tokens = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });


  const tokensJSON = await tokens.json();
  const access_token = tokensJSON.access_token;

  const user = await fetch('https://api.intra.42.fr/v2/me', {headers: {  Authorization: `Bearer ${access_token}`,}, });
  const userJSON = await user.json();


  userJSON['avatar'] = userJSON.image.link;
  userJSON['username'] = userJSON.login

  const account = await createAccount(userJSON);
  await setJwtTokens(res , account);
  return res.redirect('/profile')
}



export async function postrefreshtokenHandler(req:FastifyRequest , res:FastifyReply)
{
    const body = req.body as any;

    const payload: any = await app.jwt.verify(body.refreshToken);
    const id: string = payload.userId;

    const newAccessToken = await app.jwt.sign({ userId: id } , { expiresIn: '1h' });

    res.send({ accessToken: newAccessToken });
}




export async function getProfileCallbackhandler(req:FastifyRequest , res:FastifyReply) 
{
  // const test = await fetch('/api/users/')
  // console.log(await test.json())
  return res.type('text/html').sendFile('/pages/profile.html')
}



export async function getUserCallbackhandler(req: FastifyRequest, res: FastifyReply) 
{
  
  const id = req.id as any;
  const user = await fetch(`http://user:4001/api/users/${String(id)}`);
  
  const data = await user.json();
  return res.send(data);
}


