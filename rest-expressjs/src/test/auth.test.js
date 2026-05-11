import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { describe, it } from "node:test";

import { authMiddleware } from "../middleware/auth.middleware.ts";

describe("AuthMiddleware", () => {
  it("should throw an error when no authorization header is present", () => {
    const req = {
      get: (header) => {
        return "";
      },
    };
    const res = {};

    expect(authMiddleware.bind(this, req, res, () => {})).to.throw();
  });

  it("should throw an error when authorization header is not Bearer token", () => {
    const req = {
      get: (header) => {
        return "malformed-token";
      },
    };
    const res = {};

    expect(authMiddleware.bind(this, req, res, () => {})).to.throw();
  });

  it("should throw an error when token is invalid", () => {
    const req = {
      get: (header) => {
        return "Bearer invalid-token";
      },
    };
    const res = {};

    expect(authMiddleware.bind(this, req, res, () => {})).to.throw();
  });

  it("should receive userid when token is valid", () => {
    const testUser = { userId: "test-user-id" };
    const secretKey = process.env.JWT_SECRET;

    const req = {
      get: (header) => {
        return "Bearer valid-token";
      },
    };
    const res = {};

    // Mock jwt.verify to return the test user
    sinon.stub(jwt, "verify").returns(testUser);

    authMiddleware(req, res, () => {});

    expect(req).to.have.property("userId", testUser.userId);
  });
});
