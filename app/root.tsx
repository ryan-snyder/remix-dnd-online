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
} from "@remix-run/react";
import type { Application } from "@feathersjs/feathers";
import feather from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { FeathersProvider } from "./context";
import tailwindStylesheetUrl from "./styles/tailwind.css";

import { getUser } from "./session.server";

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

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  const [ feathers, setFeathers ] = useState<Application<any>>();

  useEffect(() => {
    console.log('Loading feathers');
    const socket = io('https://ryan-snyder-remix-dnd-online-w44qq64j35g4v-3030.githubpreview.dev/');

    const client = feather();

    client.configure(socketio(socket));

    //change this to not rely on window.localStorage
    // as this will break in remix
    if(typeof document !== "undefined") {
        client.configure(auth({
            storage: window.localStorage
        }));
    }
    console.log(client);
    setFeathers(client);
    client.authenticate().then(() => {
      console.log('signed in')
    }).catch(() => {
      console.log('logged in failed')
    })
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
