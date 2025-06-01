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


export const sendBudgetCreationEmail = async (
  email: string,
  budgetTitle: string,
  totalAmount: number,
  items: { name: string; amount: number }[]
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemListHTML = items
    .map((item) => `<li><strong>${item.name}</strong>: ₦${item.amount.toFixed(2)}</li>`)
    .join("");

  const mailOptions = {
    from: '"SmartSpend Tracker" <no-reply@smartspend.com>',
    to: email,
    subject: "Your Budget Has Been Created Successfully!",
    html: `
      <h2>Hello from SmartSpend 👋</h2>
      <p>We're excited to let you know that your budget titled <strong>${budgetTitle}</strong> has been successfully created!</p>

      <h3>Budget Summary:</h3>
      <p><strong>Total Budget Amount:</strong> ₦${totalAmount.toFixed(2)}</p>

      <h4>Items:</h4>
      <ul>
        ${itemListHTML}
      </ul>

      <p>You can view or edit this budget anytime in your dashboard.</p>

      <br />
      <p>Thanks for budgeting with SmartSpend 💸</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendAdviceEmail = async (
  email: string,
  {
    budgetTitle,
    totalBudget,
    totalSpent,
    advice,
  }: {
    budgetTitle: string;
    totalBudget: number;
    totalSpent: number;
    advice: string;
  }
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"SmartSpend Advisor" <no-reply@smartspend.com>',
    to: email,
    subject: `📊 Budget Advisory Report: ${budgetTitle}`,
    html: `
      <h3>🧠 Weekly Budget Summary</h3>
      <p><strong>Budget Title:</strong> ${budgetTitle}</p>
      <p><strong>Total Budget:</strong> ₦${totalBudget.toLocaleString()}</p>
      <p><strong>Total Spent:</strong> ₦${totalSpent.toLocaleString()}</p>
      <p><strong>Advice:</strong> ${advice}</p>
      <hr />
      <p>Keep tracking with <strong>SmartSpend</strong> – your personal finance companion!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
