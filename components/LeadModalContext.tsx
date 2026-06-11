"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = {
  open: boolean;
  intent: string;
  openModal: (intent?: string) => void;
  closeModal: () => void;
};

const LeadModalContext = createContext<Ctx>({
  open: false,
  intent: "Get Quote",
  openModal: () => {},
  closeModal: () => {},
});

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState("Get Quote");

  return (
    <LeadModalContext.Provider
      value={{
        open,
        intent,
        openModal: (i = "Get Quote") => {
          setIntent(i);
          setOpen(true);
        },
        closeModal: () => setOpen(false),
      }}
    >
      {children}
    </LeadModalContext.Provider>
  );
}

export const useLeadModal = () => useContext(LeadModalContext);
