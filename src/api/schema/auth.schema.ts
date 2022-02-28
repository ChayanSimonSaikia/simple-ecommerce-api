import { object, string, TypeOf } from "zod";

export const verifyAccountSchema = object({
  params: object({
    token: string({
      required_error: "Account Verification failed",
    }),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email address"),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    password: string({
      required_error: "Password is required",
    }),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
    id: string({
      required_error: "Process failed",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password did not match",
    path: ["passwordConfirmation"],
  }),
});

export type VerifyAccountInput = TypeOf<typeof verifyAccountSchema>["params"];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>["body"];
