import { FastifyRequest, FastifyReply } from 'fastify';
import app from '../app';


interface JwtPayload {
  userId: Number;
  // add other fields like email, role, etc. if needed
}

export async function authenticateUser(req: FastifyRequest, reply: FastifyReply)
{
  const uri:string[] = ['/pages/signup.html' , '/ws' , '/auth/intra/callback' , '/pages/verification.html' , '/pages/login.html' , '/api/signup' , '/api/login' , '/api/verify-email' , '/' , '/favicon.ico']

  if (uri.includes(req.url) == true || req.url.startsWith('/auth/') == true)
    return ;
  
  try 
  {
    const token:string = req.cookies['accessToken'] as string;
    const payload = await app.jwt.verify(token) as any;
    req.id = payload.userId
  }
  catch 
  {
    return reply.status(401).send('Unauthorized');
  }
}
