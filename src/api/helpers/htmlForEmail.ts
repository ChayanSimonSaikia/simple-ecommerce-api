export const accountVerificationMail = (firstName: string, url: string) => {
  return `<p>Hello ${firstName}</p><br/>

        <p>You registered an account on E-Com test site, before being able to use your account you need to verify that this is your email address by clicking below link</p><br/><br/>
        
        <a href=${url}>Verify Your Account</a><br/><br/>
        Kind Regards, E-Com Test`;
};

export const resetPasswordMail = (firstName: string, url: string) => {
  return `<p>Hello ${firstName}</p><br/>

        <p>You've sent a request to reset your password</p><br/><br/>
        
        <a href=${url}>Reset Password</a><br/><br/>
        Kind Regards, E-Com Test`;
};
