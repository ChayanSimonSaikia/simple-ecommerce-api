import { EmailInput, sendEmail } from "../../utils/mailer";
import UserModel, { User } from "../models/User.model";
import config from "config";
import { resetPasswordMail } from "../helpers/htmlForEmail";
import { DocumentType } from "@typegoose/typegoose";

export const findUserById = (id: string) => {
  return UserModel.findById(id);
};

export const sendResetPasswordMail = async (
  user: DocumentType<User>,
  token: string
) => {
  const url = `http://localhost:3000/auth/resetPassword/${user.id}/${token}`;
  const message: EmailInput = {
    to: user.email,
    from: config.get<string>("sendGridEmail"),
    subject: "Reset Password",
    html: resetPasswordMail(user.firstName, url),
  };
  return sendEmail(message);
};
