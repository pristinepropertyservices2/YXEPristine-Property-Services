/** NextAuth / OAuth `error` query param values → user-facing copy */
export function getAuthErrorMessage(error: string | null): string {
  if (!error) {
    return "An error occurred during authentication. Please try again.";
  }

  const messages: Record<string, string> = {
    OAuthSignin:
      "Google could not be reached from the server (network/DNS). On the VPS, try adding NODE_OPTIONS=--dns-result-order=ipv4first to your environment, then restart the app.",
    OAuthCallback:
      "Google rejected the callback. Confirm NEXTAUTH_URL matches this site (https, no trailing slash) and that this exact redirect URI is in Google Cloud: …/api/auth/callback/google",
    OAuthAccountNotLinked:
      "This email is already used with a different sign-in method. Sign in with email and password, or use the account that first registered this email.",
    OAuthCreateAccount:
      "Could not save your Google account in the database. Try again or sign up with email.",
    AccessDenied:
      "Access denied. If you use email/password, verify your email first, then try again.",
    Configuration:
      "Server sign-in configuration is invalid (NEXTAUTH_SECRET, GOOGLE_CLIENT_ID/SECRET, or DATABASE_URL). Check environment variables on the server.",
    Callback:
      "Something failed after Google authenticated. Ask an admin to check server logs.",
    Verification:
      "The sign-in or verification link is invalid or expired.",
    CredentialsSignin:
      "Invalid email or password.",
    SessionRequired:
      "You must be signed in to view that page.",
  };

  return (
    messages[error] ??
    `Sign-in failed (code: ${error}). Check server logs, or try email/password if you already have an account.`
  );
}
