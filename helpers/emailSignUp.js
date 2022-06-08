import nodemailer from "nodemailer";

async function emailSignUp(data) {
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
        subject: "Verify Your Account",
        html: `<p>Hello ${name}, verify your account on APV</p>
            <p>Your account is ready, you only need to verify your account in this link <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">here</a></p>
            
            <p>If you did not create this account, just ignore this email.</p>`
 
    })
    console.log("message sent", info.messageId);
}

export default emailSignUp
