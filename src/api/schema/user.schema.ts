import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password must contain atleast 6 characters"),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"],
  }),
});

export const logInUserSchema = object({
  body: object({
    email: string({required_error: "Email is required"}).email("Not a valid email"),
    password: string({required_error: "Password is required"})
  })
})

export const changeEmailSchema = object({
  body: object({
    email: string({required_error: "Email is required"}).email("Not a valid email")
  })
})

export const changePasswordSchema = object({
  body: object({
    newPassword: string({required_error: "New Password is required"}).min(6, "Password must be alteast 6 characters long"),
    confirmPassword: string({required_error: "Confirm Password is required"}),
    currentPassword: string({required_error: "Current Password is required"}),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Password did not match",
    path: ["currentPassword"]
  })
})


export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type logInUserInput = TypeOf<typeof logInUserSchema>["body"];
export type changeEmailInput = TypeOf<typeof changeEmailSchema>["body"];
export type changePasswordInput = TypeOf<typeof changePasswordSchema>["body"];
