import config from "config";
import { EmailInput, sendEmail } from "../../utils/mailer";
import { accountVerificationMail } from "../helpers/htmlForEmail";
import UserModel, { User } from "../models/User.model";

export const createUser = (input: Partial<User>) => {
  return UserModel.create(input);
};

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({email});
};

export const sendVerificationMail = async (
  firstName: string,
  email: string,
  token: string
) => {
  const url = `http://localhost:3000/auth/verify/${token}`;
  const message: EmailInput = {
    to: email,
    from: config.get<string>("sendGridEmail"),
    subject: "Account Verification",
    html: accountVerificationMail(firstName, url),
  };
  return sendEmail(message);
};
