import jwt from "jsonwebtoken";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be configured with at least 32 characters",
    );
  }

  return secret;
}

export type SessionPayload = {
  userId: string;
  wallet: string;
};

export function createSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, getSessionSecret(), {
    algorithm: "HS256",
    expiresIn: SESSION_DURATION_SECONDS,
    issuer: "nova-api",
    audience: "nova-web",
  });
}

export function verifySessionToken(token: string): SessionPayload {
  const decoded = jwt.verify(token, getSessionSecret(), {
    algorithms: ["HS256"],
    issuer: "nova-api",
    audience: "nova-web",
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.wallet !== "string"
  ) {
    throw new Error("Invalid session token");
  }

  return {
    userId: decoded.userId,
    wallet: decoded.wallet,
  };
}

export const sessionDurationSeconds = SESSION_DURATION_SECONDS;
