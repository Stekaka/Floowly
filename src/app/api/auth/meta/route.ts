import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const meta = {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/auth/signin`,
    token_endpoint: `${baseUrl}/api/auth/callback/credentials`,
    userinfo_endpoint: `${baseUrl}/api/auth/session`,
    jwks_uri: `${baseUrl}/api/auth/jwks`,
    response_types_supported: ["code", "id_token", "token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["HS256"],
    scopes_supported: ["openid", "profile", "email"]
  };

  return NextResponse.json(meta);
}
