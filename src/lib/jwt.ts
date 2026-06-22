import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_key_minimum_32_characters_long_jpphotography";
const key = new TextEncoder().encode(JWT_SECRET);

/**
 * Sign a session JWT payload with an expiration time
 */
export async function signJWT(payload: any, duration = "1d") {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(key);
}

/**
 * Verify and unpack a JWT token
 */
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
