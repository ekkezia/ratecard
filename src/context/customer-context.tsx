import { TConfig } from '@/config/config';
import React, { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';

export type TData = {
  isLoggedIn: boolean;
  ratecardData: TConfig[] | null;  
}

interface CustomerContextType {
  data: TData | null;
  setData: Dispatch<SetStateAction<TData | null>>;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  currency: string | null;
  setCurrency: Dispatch<SetStateAction<string | null>>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<TData | null>({
    isLoggedIn: false,
    ratecardData: null,
  });
  const [openModal, setOpenModal] = useState(false);
  const [currency, setCurrency] = useState<string | null>(null);

  return (
    <CustomerContext.Provider value={{ data, setData, openModal, setOpenModal, currency, setCurrency }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
};