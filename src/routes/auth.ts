import { RouteHandlerMethod , preValidationHookHandler , FastifySchema } from 'fastify';
import * as authController from '../controllers/auth.controller';
import * as twofaController from '../controllers/2fa.controller';
import { loginSchema, signupSchema , verifyEmailSchema } from '../validators/authSchemas';


type Route = {
    method  : 'GET' | 'POST' | 'DELETE'; 
    url     : string;
    handler : RouteHandlerMethod;
    schema? : FastifySchema;
};


const authRoutes: Route[] = [
  // Auth routes
  {
    method: "POST",
    url: "/api/signup",
    handler: authController.postSignupHandler,
    schema: { body: signupSchema },
  },
  {
    method: "POST",
    url: "/api/login",
    handler: authController.postLoginHandler,
    schema: { body: loginSchema },
  },
  {
    method: "POST",
    url: "/api/logout",
    handler: authController.postLogoutHandler,
  },

  // verify email
  {
    method: "POST",
    url: "/api/verify-email",
    handler: authController.verifyEmailHandler,
    schema: { body: verifyEmailSchema },
  },

  // oauth2
  {
    method: "GET",
    url: "/auth/google/callback",
    handler: authController.getGooglehandler,
  },
  {
    method: "GET",
    url: "/auth/intra/callback",
    handler: authController.getIntraUserhandler,
  },

  // refresh token
  {
    method: "POST",
    url: "/refresh-token",
    handler: authController.postrefreshtokenHandler,
  },

  // testing only
  {
    method: "GET",
    url: "/profile",
    handler: authController.getProfileCallbackhandler,
  },

  // 2fa 

  {
    method: "POST",
    url: "/api/2fa/email/send",
    handler: twofaController.sendEmailVerificationHandler,
  },
  {
    method: "POST",
    url: "/api/2fa/email/verify",
    handler: twofaController.verifyEmailCodeHandler,
  },
  {
    method: "GET",
    url: "/api/2fa/authenticator/setup",
    handler: twofaController.setupAuthenticatorHandler,
  },
  {
    method: "POST",
    url: "/api/2fa/authenticator/verify",
    handler: twofaController.verifyAuthenticatorCodeHandler,
  },
  {
    method: "POST",
    url: "/api/2fa/disable",
    handler: twofaController.disable2FAHandler,
  }
  

];



export {authRoutes}
