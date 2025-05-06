'use server';

import { TConfig, TConfigg, TService } from '@/config/config';

export async function handlePasswordSubmit(password: string, currency: string) {
  const correctPassword = process.env.RATECARD_PASSWORD;

  if (password === correctPassword) {
  const correctPassword = process.env.RATECARD_PASSWORD;

  if (password === correctPassword) {
    // Filter the pricing data based on the currency w Reduce method
    if (!process.env.CONFIDENTIAL_CONFIG) {
        throw new Error('CONFIDENTIAL_CONFIG is not defined in the environment variables');
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


    return {
      isLoggedIn: true,
      ratecardData: filteredData as TConfig[],
    }
  }
  } else {
    throw new Error('Authentication failed');
  }
}