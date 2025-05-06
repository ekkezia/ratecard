import { authOptions } from '@/lib/authOptions';
import { SignJWT } from 'jose';
import { getServerSession } from 'next-auth';

export async function GET() {
  // Get the user's session
  const session = await getServerSession(authOptions);
  console.log('session', session)

  // Check if the user is authenticated and their email matches email
  if (!session || session.user?.email !== "e.kezia@gmail.com") {
    return new Response("Unauthorized", { status: 401 });
  }

  // Generate the token
  const token = await new SignJWT({ access: 'shared_resource' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    // .setExpirationTime('24h') // Set token expiration time
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return Response.json({ token });
}