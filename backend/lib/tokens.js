import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import config from "../config.js";

const { algorithm, audience, expiresIn, issuer, secret, type } = config.auth.accessToken;

export function generateAuthenticationToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };

  return {
    accessToken: {
      token: generateJwtToken(payload),
      type,
      expiresAt: createExpirationDate(expiresIn),
      expiresInMS: expiresIn
    },
  };
}

export function generateJwtToken(payload) {
  return jwt.sign(payload, secret, { algorithm, audience, expiresIn, issuer });
}

export function verifyJwtToken(token) {
  try {
    return jwt.verify(token, secret, { algorithms: algorithm });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function generateRandomString() {
  return crypto.randomBytes(128).toString("base64");
}

function createExpirationDate(expiresInMs) {
  return new Date(new Date().valueOf() + expiresInMs);
}
