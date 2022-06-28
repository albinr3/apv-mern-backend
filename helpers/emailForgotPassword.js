import nodemailer from "nodemailer";

async function emailForgotPassword(data) {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    });

    const {name, email, token} = data;

    //send the email
    const info = await transport.sendMail({
        from: "APV- Patient manager",
        to: email,
        subject: "Reset your password",
        html: `<p>Hello ${name}, Reset your password on APV</p>
            <p>You only need to click this link to set a new password <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">here</a></p>
            
            <p>If you did not create this account, just ignore this email.</p>`
 
    }, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      })
   
}

export default emailForgotPassword