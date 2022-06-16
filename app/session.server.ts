import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { client } from "~/feathers.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
/**
 * TODO:
 * make all of the below work with feathers
 * Right now, some of it does
 */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});


const USER_SESSION_KEY = "userId";
const JWT_SESSION_KEY = "jwt"

export async function getSession(request: any) {
  const { cookie } = request.headers;
  return sessionStorage.getSession(cookie);
}

export async function getToken(request: Request) {
  const session = await getSession(request);
  const token = session.get(JWT_SESSION_KEY);
  return token; 
}
export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  const token = await getToken(request);
  if (userId === undefined) return null;
  try {
    const user = await getUserById(userId, token);
    if (user._id) return user;
  } catch {
    throw await logout(request);
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = request.url
) {
  const userId = await getUserId(request);
  console.log('Got user id....', userId)
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  const token = await getToken(request);
  const user = await getUserById(userId, token);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  token,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  token: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  session.set(JWT_SESSION_KEY, token);
  console.log(`Created session for user ${userId}`);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  await client.logout();
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
