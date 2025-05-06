import { TConfig, TConfigg, TService } from '@/config/config';
import { jwtVerify } from 'jose';

export async function POST(request: Request) {
  try {
    const { token, currency } = await request.json();

    if (!token) {
      return new Response("Token is required", { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

      if (!process.env.CONFIDENTIAL_CONFIG) {
        throw new Error("CONFIDENTIAL_CONFIG environment variable is not set");
      }
      const confidentialConfig = JSON.parse(process.env.CONFIDENTIAL_CONFIG) as TConfigg[];
    
        const filteredData = confidentialConfig.map((data) => ({
          ...data,
          services: Object.entries(data.services).reduce((acc: Record<string, TService[string]>, [key, val]) => {
            acc[key] = {
              ...val,
              price: val.price[currency as keyof typeof val.price]
            };
            return acc;
          }, {})
          
        }));
    
    
    return new Response(JSON.stringify({ success: true, tokenData: payload, data: {
          isLoggedIn: true,
          ratecardData: filteredData as TConfig[],
        } }), { status: 200 });
  } catch (error) {
    console.error('Error validating token:', error);
    return new Response("Invalid or expired token", { status: 401 });
  }
}