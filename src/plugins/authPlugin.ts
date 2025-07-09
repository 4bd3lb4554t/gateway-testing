import { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import auth2 from '@fastify/oauth2';
import session from '@fastify/session';
import jwt from '@fastify/jwt';


// const multipart_config = {
//   attachFieldsToBody: false,
//   addToBody: false,
// }


// const fastifyStatic_config = {
//     root: '/var/www/html/frontend',
//     prefix: '/',
// }


const auth2_config:any = {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.ID,
      secret: process.env.SECRET
    },
    auth: {
      authorizeHost: 'https://accounts.google.com',
      authorizePath: '/o/oauth2/v2/auth',
      tokenHost: 'https://oauth2.googleapis.com',
      tokenPath: '/token'
    }
  },
  startRedirectPath: '/auth/google',
  callbackUri: 'http://localhost:4000/auth/google/callback'
}



const session_option = {
    secret: 'this_is_a_very_long_secret_key_that_is_secure',
    cookie: {
    secure: false, 
    maxAge: 1000 * 60 * 10,
    },
    saveUninitialized: false,
  }




  
  
const jwt_config:any = {
    secret: process.env.JWTSECRET
  }
  



  
export default async function registerPlugins(app:FastifyInstance)
{
  app.register(cookie);
  app.register(session, session_option );
  app.register(auth2 , auth2_config);
  app.register(jwt, jwt_config);

}
