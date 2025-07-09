
import prisma from "../db/database";
import redis from "../integration/redisClient";
import { VerifyPassword } from "../utils/hashedPassword";

export const AuthErrors = {
    // Signup errors
    USERNAME_DUP : 'Username is already in use. Try another one.',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    USER_EXISTS: 'User already exists',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    USERNAME_REQUIRED: 'Username is required',
    INVALID_EMAIL_FORMAT: 'Invalid email format',
  
    // Login errors
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    ACCOUNT_LOCKED: 'Account is locked',
    TOO_MANY_ATTEMPTS: 'Too many login attempts, please try again later',
  
    // Email verification errors
    
  
    OAUTH_LOGIN_REQUIRED: 'This account was created with an external provider (e.g. Google, 42). Please use that method to log in.',
    VERIFICATION_CODE_EXPIRED: 'Verification code has expired. Please sign up again or request a new code.',
    VERIFICATION_TOKEN_EXPIRED: 'Verification token expired',
    VERIFICATION_TOKEN_INVALID: 'Invalid verification token',
    EMAIL_NOT_VERIFIED: 'You have already signed up. Please verify your email before continuing.',
    EMAIL_ALREADY_VERIFIED: 'Your email is already verified. You can log in directly.',
    VERIFICATION_FAILED: 'Email verification failed, please try again',
    
  } as const;
  
  


export async function isUserVerified(body:any)
{
    const userdb = await prisma.user.findUnique({ where: { email: body.email }})
    if(userdb && userdb.password)
      throw new Error(AuthErrors.EMAIL_ALREADY_VERIFIED);

    const data = await redis.get(body.email);
    if(!data)
        throw new Error(AuthErrors.VERIFICATION_CODE_EXPIRED)
    
    const parsed = JSON.parse(data);
    if(parsed.code != body.code)
      throw new Error(AuthErrors.VERIFICATION_FAILED)

    delete parsed.code;
}





export async function isUserAllowedToLogin(body:any , user:any | null)
{
    if(!user)
      throw new Error(AuthErrors.USER_NOT_FOUND)

    if(!user.password)
        throw new Error(AuthErrors.OAUTH_LOGIN_REQUIRED)

    if(await VerifyPassword(body.password , user.password) ==  false)
      throw new Error(AuthErrors.INVALID_CREDENTIALS)

    if(user.is_2fa_enabled)
        return;
}



export async function isUserAlreadyRegistered(body:any)
{
    const user = await prisma.user.findUnique({ where: { email: body.email}})

    if(!user)
        return;

    if(user.password)
      throw new Error(AuthErrors.USER_EXISTS);
    
    if(user.username == body.username)
      throw new Error(AuthErrors.USERNAME_DUP);
}