/** Return the configured JWT signing key or fail with an actionable message. */
export default function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error('JWT_SECRET is not configured. Set it in the host environment and restart or redeploy the app.');
  }
  return secret;
}