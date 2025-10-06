"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Centre = {
  id: string;
  identifiant: string;
  nom_centre: string;
  email?: string;
  localite?: string;
};

type CentreContextType = {
  centre: Centre | null;
  loading: boolean;
  refreshCentre: () => void;
};

const CentreContext = createContext<CentreContextType>({
  centre: null,
  loading: true,
  refreshCentre: () => {},
});

export const useCentre = () => useContext(CentreContext);

export const CentreProvider = ({ children }: { children: ReactNode }) => {
  const [centre, setCentre] = useState<Centre | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCentre = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/centre", { credentials: "include" });
      if (!res.ok) {
        setCentre(null);
        return;
      }
      const data = await res.json();
      setCentre(data);
    } catch (err) {
      setCentre(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentre();
  }, []);

  return (
    <CentreContext.Provider value={{ centre, loading, refreshCentre: fetchCentre }}>
      {children}
    </CentreContext.Provider>
  );
};
