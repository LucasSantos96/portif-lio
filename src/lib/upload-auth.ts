import { createHash, timingSafeEqual } from "node:crypto";

export const UPLOAD_SESSION_COOKIE = "upload_session";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isUploadPasswordValid(password: string) {
  const expected = process.env.UPLOAD_PASSWORD;

  if (!expected) {
    return false;
  }

  const providedHash = Buffer.from(hashValue(password));
  const expectedHash = Buffer.from(hashValue(expected));

  if (providedHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(providedHash, expectedHash);
}

export function getUploadSessionToken() {
  const expected = process.env.UPLOAD_PASSWORD;

  if (!expected) {
    return null;
  }

  return hashValue(`upload:${expected}`);
}

export function isUploadSessionValid(sessionValue?: string) {
  if (!sessionValue) {
    return false;
  }

  const expectedToken = getUploadSessionToken();

  if (!expectedToken) {
    return false;
  }

  const provided = Buffer.from(sessionValue);
  const expected = Buffer.from(expectedToken);

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}
