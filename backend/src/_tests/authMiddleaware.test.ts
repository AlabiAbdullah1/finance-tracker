import { protect } from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import User from "../models/User";

jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("protect middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if no token provided", async () => {
    req.headers.authorization = "";

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Not authorized, no token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token does not start with Bearer", async () => {
    req.headers.authorization = "InvalidToken";

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Not authorized, no token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if jwt.verify throws error", async () => {
    req.headers.authorization = "Bearer validtoken";
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid token");
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("validtoken", expect.any(String));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Not authorized, token failed" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if user not found", async () => {
    req.headers.authorization = "Bearer validtoken";
    (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    (User.findById as jest.Mock).mockResolvedValue(null);

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Not authorized, user not found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach user to req if token and user valid", async () => {
    const user = { _id: "user123", name: "John", password: "hashed" };
    req.headers.authorization = "Bearer validtoken";
    (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    (User.findById as jest.Mock).mockResolvedValue(user);

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
