import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;

    const mailOptions = {
        from: '"SmartSpend Tracker" <no-reply@smartspend.com>',
        to: email,
        subject: "Verify Your Email",
        html: `
            <h2>Welcome to SmartSpend!</h2>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <br /><br />
            <p>If you did not request this, please ignore this message.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};
