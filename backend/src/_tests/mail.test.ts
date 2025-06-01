import nodemailer from "nodemailer";
import { sendVerificationEmail } from "../utils/mail"; 

jest.mock("nodemailer");

describe("sendVerificationEmail", () => {
  const sendMailMock = jest.fn().mockResolvedValue(true);
  const createTransportMock = jest.fn(() => ({
    sendMail: sendMailMock,
  }));

  beforeAll(() => {
    // @ts-ignore
    nodemailer.createTransport = createTransportMock;
    process.env.EMAIL_USER = "testuser@gmail.com";
    process.env.EMAIL_PASS = "testpass";
    process.env.CLIENT_URL = "http://localhost:3000";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send verification email with correct options", async () => {
    const email = "user@example.com";
    const token = "12345token";

    await sendVerificationEmail(email, token);

    expect(createTransportMock).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"SmartSpend Tracker" <no-reply@smartspend.com>',
        to: email,
        subject: "Verify Your Email",
        html: expect.stringContaining(
          `${process.env.CLIENT_URL}/verify/${token}`
        ),
      })
    );
  });

  it("should throw if sendMail fails", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("SMTP error"));

    await expect(
      sendVerificationEmail("fail@example.com", "failtoken")
    ).rejects.toThrow("SMTP error");
  });
});
