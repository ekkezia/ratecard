'use client'

import { CustomerProvider } from '@/context/customer-context';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import type { Session } from "next-auth";

interface ClientLayoutProps {
  children?: React.ReactNode;
  session: Session | null;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children,   session,
 }) => {
  return (
    <SessionProvider session={session}>
      <CustomerProvider>
        {children}
      </CustomerProvider>
    </SessionProvider>
  );
};

export default ClientLayout;