import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Application } from "@feathersjs/feathers";

type ProviderProps = {
  feathers: Application<any> | undefined;
  children: ReactNode;
};

const context = createContext<Application<any> | undefined>(undefined);

export function useFeathers() {
  return useContext(context);
}

export function FeathersProvider({ feathers, children }: ProviderProps) {
  return <context.Provider value={feathers}>{children}</context.Provider>;
}