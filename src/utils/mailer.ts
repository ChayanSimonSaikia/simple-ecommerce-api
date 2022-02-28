import sGrid from "@sendgrid/mail";
import config from "config";

export type EmailInput = {
  to: string;
  from: string;
  subject: string;
  html: string;
};
export const sendEmail = (message: EmailInput) => {
  sGrid.setApiKey(config.get<string>("sendGridApi"));
  return sGrid.send(message);
};
