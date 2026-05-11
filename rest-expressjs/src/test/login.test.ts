import { expect } from "chai";
import bcrypt from "bcrypt";
import sinon from "sinon";
import { describe, it } from "node:test";
import type { Request, Response } from "express";

import { loginUser } from "../controllers/user.controller.ts";
import { User } from "../db/mongoose.controller.ts";

describe("LoginController", () => {
  it("should return a token when login is successful", async () => {
    sinon.stub(User, "findOne").resolves({
      _id: "test-user-id",
      email: "username",
      username: "test-user-id",
      password: "hashed-password",
    });

    sinon.stub(bcrypt, "compare").resolves(true);

    const req = {
      body: {
        username: "test-user-id",
        password: "hashed-password",
      },
    } as Request;
    const res = {
      statusCode: 500,
      message: "",
      user: "",
      token: "",
      status: function (s: number) {
        (this as any).statusCode = s;
        return this;
      },
      json: function (data: {
        message?: string;
        user?: string;
        token?: string;
      }) {
        if (data) {
          (this as any).message = data.message || "";
          (this as any).user = data.user || "";
          (this as any).token = data.token || "";
        }
        return this;
      },
    } as unknown as Response;

    await loginUser(req, res, () => {});

    expect(res).to.have.property("statusCode", 200);
  });
});
