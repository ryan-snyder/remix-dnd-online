import { useEffect, useState } from "react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { Application } from "@feathersjs/feathers";
import feather from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { FeathersProvider } from "./context";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser} from "./session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ context }) => {
  const { req } = context;
  return json<LoaderData>({
    user: await getUser(req)
  });
};

export default function App() {
  const [ feathers, setFeathers ] = useState<Application>();
  const user = useLoaderData();
  useEffect(() => {
    console.log('Loading feathers');
    const socket = io();

    const client = feather();

    client.configure(socketio(socket));
    client.configure(auth({
            storage: window.localStorage
    }));
    setFeathers(client);
  }, [])


  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <FeathersProvider feathers={feathers}>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </FeathersProvider>
      </body>
    </html>
  );
}
