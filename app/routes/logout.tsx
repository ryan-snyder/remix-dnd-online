import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";

export const action: ActionFunction = async ({ context }) => {
  const { req } = context;
  return logout(req);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
