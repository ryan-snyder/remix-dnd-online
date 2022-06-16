import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Application } from "@feathersjs/feathers";

type ProviderProps = {
  feathers: Application | undefined;
  children: ReactNode;
};

const context = createContext<Application | undefined>(undefined);

export function useFeathers() {
  return useContext(context);
}

export function FeathersProvider({ feathers, children }: ProviderProps) {
  return <context.Provider value={feathers}>{children}</context.Provider>;
}