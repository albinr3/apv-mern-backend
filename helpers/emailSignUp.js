import nodemailer from "nodemailer";

async function emailSignUp(data) {
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
        subject: "Verify Your Account",
        html: `<p>Hello ${name}, verify your account on APV</p>
            <p>Your account is ready, you only need to verify your account in this link <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">here</a></p>
            
            <p>If you did not create this account, just ignore this email.</p>`
 
    }, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      })
    
}

export default emailSignUp
