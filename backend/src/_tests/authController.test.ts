
import { getMe, loginUser, registerUser, verifyEmail } from "../controllers/authController";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/mail";
import { generateToken } from "../utils/generateToken";
import request from "supertest";
import app from "../app"; 

jest.mock("../models/User");
jest.mock("bcryptjs");
jest.mock("../utils/mail");
jest.mock("uuid", () => ({ v4: () => "mock-uuid" }));
jest.mock("../utils/generateToken");

// TEST FOR REGISTERING USER
describe("registerUser", () => {
  const req: any = { body: {} };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email exists", async () => {
    req.body = { name: "testuser", email: "test@example.com", password: "password" };
    (User.findOne as jest.Mock).mockImplementation(({ email }) => {
      if (email === "test@example.com") return Promise.resolve({ _id: "123" });
      return null;
    });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "email already exists" });
  });

  it("should return 400 if username exists", async () => {
    req.body = { name: "testuser", email: "new@example.com", password: "password" };
    (User.findOne as jest.Mock).mockImplementation(({ name, email }) => {
      if (name === "testuser") return Promise.resolve({ _id: "123" });
      if (email === "new@example.com") return null;
      return null;
    });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Username already exists" });
  });

  it("should create user and send verification email", async () => {
    req.body = { name: "newuser", email: "newuser@example.com", password: "password" };
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (User.create as jest.Mock).mockResolvedValue({
      _id: "user-id",
      name: "newuser",
      email: "newuser@example.com",
      password: "hashedPassword",
      verificationToken: "mock-uuid",
      isVerified: false,
    });
    (sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

    await registerUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    expect(User.create).toHaveBeenCalledWith({
      name: "newuser",
      email: "newuser@example.com",
      password: "hashedPassword",
      verificationToken: "mock-uuid",
      isVerified: false,
    });
    expect(sendVerificationEmail).toHaveBeenCalledWith("newuser@example.com", "mock-uuid");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String), user: expect.any(Object) })
    );
  });
});


// TEST FOR LOGGING IN USER
describe("loginUser", () => {
  const req: any = { body: {} };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user not found", async () => {
    req.body = { email: "noone@example.com", password: "password" };
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return 401 if password mismatch", async () => {
    req.body = { email: "user@example.com", password: "wrongpass" };
    (User.findOne as jest.Mock).mockResolvedValue({
      password: "hashedpassword",
      isVerified: true,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return 403 if user not verified", async () => {
    req.body = { email: "user@example.com", password: "correctpass" };
    (User.findOne as jest.Mock).mockResolvedValue({
      password: "hashedpassword",
      isVerified: false,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Please verify your email before logging in.",
    });
  });

  it("should return user info and token on success", async () => {
    req.body = { email: "user@example.com", password: "correctpass" };
    const mockUser = {
      _id: "user-id",
      name: "user",
      email: "user@example.com",
      password: "hashedpassword",
      isVerified: true,
    };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue("token123");

    await loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: "user-id",
      name: "user",
      email: "user@example.com",
      token: "token123",
    });
  });
});

// TEST FOR GETTING CURRENT USER

describe("getMe", () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no user on req", async () => {
    const req: any = { user: null };

    await getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Not authorized" });
  });

  it("should return user if user exists on req", async () => {
    const req: any = { user: { _id: "user-id", name: "testuser" } };

    await getMe(req, res);

    expect(res.json).toHaveBeenCalledWith({ _id: "user-id", name: "testuser" });
  });
});


// TEST FOR VERIFYING EMAIL

describe("verifyEmail", () => {
  const req: any = { params: {} };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if user not found with token", async () => {
    req.params = { token: "invalid-token" };
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired verification link" });
  });

  it("should verify user email successfully", async () => {
    const mockUser = {
      isVerified: false,
      verificationToken: "valid-token",
      save: jest.fn().mockResolvedValue(true),
    };

    req.params = { token: "valid-token" };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await verifyEmail(req, res);

    expect(mockUser.isVerified).toBe(true);
    expect(mockUser.verificationToken).toBe("");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Email verified successfully. You can now log in." });
  });
});












describe("POST /register", () => {
  it("should create user and send verification email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "integrationuser", email: "int@example.com", password: "password" });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/User created successfully/i);
  });
});

