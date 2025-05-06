import { CONFIG, TService } from '@/config/config';
// Removed incorrect import of 'data' as it is not used correctly
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET request received' });
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const correctPassword = process.env.RATECARD_PASSWORD;

  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency') || 'usd';

  if (password === correctPassword) {
    // Filter the pricing data based on the currency w Reduce method
    const filteredData = CONFIG.map((data) => ({
      ...data,
      services: Object.entries(data.services).reduce((acc: Record<string, TService[string]>, [key, val]) => {
        acc[key] = {
          ...val,
          price: val.price[currency as keyof typeof val.price]
        };
        return acc;
      }, {})
      
    }));


    return NextResponse.json({ data: filteredData }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}


    // Map method
    // const mapdata = CONFIG.map((data) => {
    //   const { title, color, services } = data;
    //   const filteredServices = Object.fromEntries(Object.entries(services).map(([key, val]) => [
    //     key, 
    //     {
    //       ...val,
    //       price: val.price[currency],
    //     }
    //   ]));
    //   return {
    //     title,
    //     color,
    //     services: filteredServices,
    //   };
    // });
