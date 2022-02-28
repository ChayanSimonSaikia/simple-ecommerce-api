import { NextFunction, Request, Response } from 'express'
import config from 'config'
import { verifyToken } from '../helpers/verifyToken'
import {
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyAccountInput,
} from '../schema/auth.schema'
import { findUserById, sendResetPasswordMail } from '../services/auth.service'
import createHttpError from 'http-errors'
import { signResetToken, signVerificationToken } from '../../utils/jwt'
import { findUserByEmail, sendVerificationMail } from '../services/user.service'

export const verifyAccount = async (
  req: Request<VerifyAccountInput>,
  res: Response,
  next: NextFunction,
) => {
  const token = req.params.token
  const secret = config.get<string>('emailSecret')

  try {
    const email = await verifyToken(token, secret)

    const user = await findUserByEmail(email)
    if (!user) throw new createHttpError.NotFound('Could not find the user')
    if (user.verified)
      throw new createHttpError.NotAcceptable('Already verified')

    user.verified = true
    await user.save()

    res.json({ message: 'User verified' })
  } catch (error: any) {
    if (error.name === 'MongoServerError')
      return next(
        new createHttpError.InternalServerError('Somewent went wrong'),
      )
    next(error)
  }
}

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction,
) => {
  const email = req.body.email

  try {
    const user = await findUserByEmail(email)
    if (!user)
      throw new createHttpError.NotFound('No user found with that email')

    const token = await signResetToken(user.id, user.password, '5m')

    await sendResetPasswordMail(user, token)
    res.json({ message: 'Password Reset link sent to your email' })
  } catch (error) {
    next(error)
  }
}

export const resetPasswordHandler = async (
  req: Request<{}, {}, Omit<ResetPasswordInput, 'passwordConfirmation'>>,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers['authorization']
  if (!header)
    return next(new createHttpError.Forbidden('Can not proceed further'))

  const token = header.split(' ')[1]
  const body = req.body

  try {
    const user = await findUserById(body.id)
    if (!user) throw new createHttpError.Forbidden('Can not proceed further')

    const secret = config.get<string>('passwordSecret') + user.password

    const id = await verifyToken(token, secret)
    if (id !== body.id)
      throw new createHttpError.Forbidden('Can not proceed further')

    if (user.password === body.password)
      throw new createHttpError.BadRequest(
        'Can not be the same password, use different',
      )

    user.password = body.password
    await user.save()

    return res.json({ message: 'Password has beed reset' })
  } catch (error) {
    next(error)
  }
}

export const sendVerificationMail_loggedIn = async (
  req: Request,
  res: Response<{}, { userId: string }>,
  next: NextFunction,
) => {
  const userId = res.locals.userId
  try {
    const user = await findUserById(userId)
    if (!user) throw new createHttpError.InternalServerError()

    const token = await signVerificationToken('5m', user.email)
    await sendVerificationMail(user.firstName, user.email, token)
    res.json({message: "Verfication link sent to your email"})
  } catch (error) {
    next(error)
  }
}
