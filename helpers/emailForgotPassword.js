import nodemailer from "nodemailer";

async function emailForgotPassword(data) {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
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
 
    })
    console.log("message sent", info.messageId);
}

export default emailForgotPassword