var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react");
var import_server = require("react-dom/server");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route:/workspaces/remix-dnd-online/app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_react3 = require("react");
var import_node2 = require("@remix-run/node");
var import_react4 = require("@remix-run/react");
var import_feathers4 = __toESM(require("@feathersjs/feathers"));
var import_socketio_client2 = __toESM(require("@feathersjs/socketio-client"));
var import_authentication_client2 = __toESM(require("@feathersjs/authentication-client"));
var import_socket2 = __toESM(require("socket.io-client"));

// app/context.tsx
var import_react2 = require("react");
var context = (0, import_react2.createContext)(void 0);
function useFeathers() {
  return (0, import_react2.useContext)(context);
}
function FeathersProvider({ feathers, children }) {
  return /* @__PURE__ */ React.createElement(context.Provider, {
    value: feathers
  }, children);
}

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-TOTVRZRS.css";

// app/session.server.ts
var import_node = require("@remix-run/node");
var import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/db.server.ts
var import_client = require("@prisma/client");
var prisma;
if (false) {
  prisma = new import_client.PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new import_client.PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

// app/feathers.server.ts
var import_socket = __toESM(require("socket.io-client"));
var import_feathers = __toESM(require("@feathersjs/feathers"));
var import_socketio_client = __toESM(require("@feathersjs/socketio-client"));
var import_authentication_client = __toESM(require("@feathersjs/authentication-client"));
var socket = (0, import_socket.default)("http://localhost:3000");
var client = (0, import_feathers.default)();
client.configure((0, import_socketio_client.default)(socket));
client.configure((0, import_authentication_client.default)());
client.reAuthenticate().then(() => {
  console.log("Authenticated connection...");
}).catch((e) => {
  console.log("failed to authenticate but its fine");
});

// app/models/user.server.ts
async function getUserById(id, token) {
  console.log("Checking for token...");
  console.log(await client.authentication.getAccessToken());
  return client.service("users").get(id);
}
async function createUser(email, password) {
  return client.service("users").create({ email, password });
}
async function authUser(email, password) {
  return client.authenticate({
    strategy: "local",
    email,
    password
  });
}
async function createAndAuthUser(email, password) {
  return await createUser(email, password).then(() => {
    return authUser(email, password);
  });
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: false
  }
});
var USER_SESSION_KEY = "userId";
var JWT_SESSION_KEY = "jwt";
async function getSession(request) {
  const { cookie } = request.headers;
  return sessionStorage.getSession(cookie);
}
async function getToken(request) {
  const session = await getSession(request);
  const token = session.get(JWT_SESSION_KEY);
  return token;
}
async function getUserId(request) {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
async function getUser(request) {
  const userId = await getUserId(request);
  const token = await getToken(request);
  if (userId === void 0)
    return null;
  try {
    const user = await getUserById(userId, token);
    if (user._id)
      return user;
  } catch {
    throw await logout(request);
  }
}
async function requireUserId(request, redirectTo = request.url) {
  const userId = await getUserId(request);
  console.log("Got user id....", userId);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  token,
  remember,
  redirectTo
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  session.set(JWT_SESSION_KEY, token);
  console.log(`Created session for user ${userId}`);
  return (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  const session = await getSession(request);
  await client.logout();
  return (0, import_node.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// route:/workspaces/remix-dnd-online/app/root.tsx
var links = () => {
  return [{ rel: "stylesheet", href: tailwind_default }];
};
var meta = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1"
});
var loader = async ({ context: context2 }) => {
  const { req } = context2;
  return (0, import_node2.json)({
    user: await getUser(req)
  });
};
function App() {
  const [feathers, setFeathers] = (0, import_react3.useState)();
  const user = (0, import_react4.useLoaderData)();
  (0, import_react3.useEffect)(() => {
    console.log("Loading feathers");
    const socket2 = (0, import_socket2.default)();
    const client2 = (0, import_feathers4.default)();
    client2.configure((0, import_socketio_client2.default)(socket2));
    client2.configure((0, import_authentication_client2.default)({
      storage: window.localStorage
    }));
    setFeathers(client2);
  }, []);
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en",
    className: "h-full"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react4.Meta, null), /* @__PURE__ */ React.createElement(import_react4.Links, null)), /* @__PURE__ */ React.createElement("body", {
    className: "h-full"
  }, /* @__PURE__ */ React.createElement(FeathersProvider, {
    feathers
  }, /* @__PURE__ */ React.createElement(import_react4.Outlet, null), /* @__PURE__ */ React.createElement(import_react4.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_react4.Scripts, null), /* @__PURE__ */ React.createElement(import_react4.LiveReload, null))));
}

// route:/workspaces/remix-dnd-online/app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader2
});
var loader2 = async ({ context: context2 }) => {
  const { req } = context2;
  const host = req.headers.get("X-Forwarded-Host") ?? req.headers.get("host");
  try {
    const url = new URL("/", `http://${host}`);
    await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]);
    return new Response("OK");
  } catch (error) {
    console.log("healthcheck \u274C", { error });
    return new Response("ERROR", { status: 500 });
  }
};

// route:/workspaces/remix-dnd-online/app/routes/characters.tsx
var characters_exports = {};
__export(characters_exports, {
  default: () => NotesPage,
  loader: () => loader3
});
var import_node3 = require("@remix-run/node");
var import_react7 = require("@remix-run/react");

// app/utils.ts
var import_react5 = require("@remix-run/react");
var import_react6 = require("react");
var DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }
  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }
  return to;
}
function useMatchesData(id) {
  const matchingRoutes = (0, import_react5.useMatches)();
  const route = (0, import_react6.useMemo)(() => matchingRoutes.find((route2) => route2.id === id), [matchingRoutes, id]);
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}
function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    console.log("returning undefined...");
    return void 0;
  }
  return data.user;
}
function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error("No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.");
  }
  return maybeUser;
}
function validateEmail(email) {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

// app/models/character.server.ts
async function getCharactersByUser() {
  return client.service("characters").find();
}

// route:/workspaces/remix-dnd-online/app/routes/characters.tsx
var loader3 = async ({ context: context2 }) => {
  const { req } = context2;
  const userId = await requireUserId(req);
  const { data } = await getCharactersByUser();
  return (0, import_node3.json)({ characters: data });
};
function NotesPage() {
  const data = (0, import_react7.useLoaderData)();
  const user = useUser();
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full min-h-screen flex-col"
  }, /* @__PURE__ */ React.createElement("header", {
    className: "flex items-center justify-between bg-slate-800 p-4 text-white"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-bold"
  }, /* @__PURE__ */ React.createElement(import_react7.Link, {
    to: "."
  }, "Characters")), /* @__PURE__ */ React.createElement("p", null, user.email), /* @__PURE__ */ React.createElement(import_react7.Form, {
    action: "/logout",
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
  }, "Logout"))), /* @__PURE__ */ React.createElement("main", {
    className: "flex h-full bg-white"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "h-full w-80 border-r bg-gray-50"
  }, /* @__PURE__ */ React.createElement(import_react7.Link, {
    to: "new",
    className: "block p-4 text-xl text-blue-500"
  }, "+ New Character"), /* @__PURE__ */ React.createElement("hr", null), data.characters.length === 0 ? /* @__PURE__ */ React.createElement("p", {
    className: "p-4"
  }, "No characters yet") : /* @__PURE__ */ React.createElement("ol", null, data.characters.map((note) => /* @__PURE__ */ React.createElement("li", {
    key: note.id
  }, /* @__PURE__ */ React.createElement(import_react7.NavLink, {
    className: ({ isActive }) => `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`,
    to: note.id
  }, "\u{1F4DD} ", note.title))))), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 p-6"
  }, /* @__PURE__ */ React.createElement(import_react7.Outlet, null))));
}

// route:/workspaces/remix-dnd-online/app/routes/characters/$noteId.tsx
var noteId_exports = {};
__export(noteId_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  action: () => action,
  default: () => NoteDetailsPage,
  loader: () => loader4
});
var import_node4 = require("@remix-run/node");
var import_react8 = require("@remix-run/react");
var import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/models/note.server.ts
function getNote({
  id,
  userId
}) {
  return prisma.note.findFirst({
    where: { id, userId }
  });
}
function createNote({
  body,
  title,
  userId
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
function deleteNote({
  id,
  userId
}) {
  return prisma.note.deleteMany({
    where: { id, userId }
  });
}

// route:/workspaces/remix-dnd-online/app/routes/characters/$noteId.tsx
var loader4 = async ({ request, params }) => {
  const userId = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.noteId, "noteId not found");
  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node4.json)({ note });
};
var action = async ({ request, params }) => {
  const userId = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.noteId, "noteId not found");
  await deleteNote({ userId, id: params.noteId });
  return (0, import_node4.redirect)("/notes");
};
function NoteDetailsPage() {
  const data = (0, import_react8.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", {
    className: "text-2xl font-bold"
  }, data.note.title), /* @__PURE__ */ React.createElement("p", {
    className: "py-6"
  }, data.note.body), /* @__PURE__ */ React.createElement("hr", {
    className: "my-4"
  }), /* @__PURE__ */ React.createElement(import_react8.Form, {
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Delete")));
}
function ErrorBoundary({ error }) {
  console.error(error);
  return /* @__PURE__ */ React.createElement("div", null, "An unexpected error occurred: ", error.message);
}
function CatchBoundary() {
  const caught = (0, import_react8.useCatch)();
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement("div", null, "Note not found");
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// route:/workspaces/remix-dnd-online/app/routes/characters/index.tsx
var characters_exports2 = {};
__export(characters_exports2, {
  default: () => NoteIndexPage
});
var import_react9 = require("@remix-run/react");
function NoteIndexPage() {
  return /* @__PURE__ */ React.createElement("p", null, "No character selected. Select a character on the left, or", " ", /* @__PURE__ */ React.createElement(import_react9.Link, {
    to: "new",
    className: "text-blue-500 underline"
  }, "create a new character."));
}

// route:/workspaces/remix-dnd-online/app/routes/characters/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action2,
  default: () => NewNotePage
});
var import_node5 = require("@remix-run/node");
var import_react10 = require("@remix-run/react");
var React2 = __toESM(require("react"));
var action2 = async ({ context: context2 }) => {
  const { req } = context2;
  const userId = await requireUserId(req);
  const formData = await req.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  if (typeof title !== "string" || title.length === 0) {
    return (0, import_node5.json)({ errors: { title: "Title is required" } }, { status: 400 });
  }
  if (typeof body !== "string" || body.length === 0) {
    return (0, import_node5.json)({ errors: { body: "Body is required" } }, { status: 400 });
  }
  const note = await createNote({ title, body, userId });
  return (0, import_node5.redirect)(`/characters/${note.id}`);
};
function NewNotePage() {
  var _a, _b, _c, _d, _e, _f;
  const actionData = (0, import_react10.useActionData)();
  const titleRef = React2.useRef(null);
  const bodyRef = React2.useRef(null);
  React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.title) {
      (_b2 = titleRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.body) {
      (_d2 = bodyRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React2.createElement(import_react10.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    className: "flex w-full flex-col gap-1"
  }, /* @__PURE__ */ React2.createElement("span", null, "Title: "), /* @__PURE__ */ React2.createElement("input", {
    ref: titleRef,
    name: "title",
    className: "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.title) ? true : void 0,
    "aria-errormessage": ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.title) ? "title-error" : void 0
  })), ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ React2.createElement("div", {
    className: "pt-1 text-red-700",
    id: "title-error"
  }, actionData.errors.title)), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    className: "flex w-full flex-col gap-1"
  }, /* @__PURE__ */ React2.createElement("span", null, "Body: "), /* @__PURE__ */ React2.createElement("textarea", {
    ref: bodyRef,
    name: "body",
    rows: 8,
    className: "w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6",
    "aria-invalid": ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.body) ? true : void 0,
    "aria-errormessage": ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.body) ? "body-error" : void 0
  })), ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.body) && /* @__PURE__ */ React2.createElement("div", {
    className: "pt-1 text-red-700",
    id: "body-error"
  }, actionData.errors.body)), /* @__PURE__ */ React2.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */ React2.createElement("button", {
    type: "submit",
    className: "rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Save")));
}

// route:/workspaces/remix-dnd-online/app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action3,
  loader: () => loader5
});
var import_node6 = require("@remix-run/node");
var action3 = async ({ context: context2 }) => {
  const { req } = context2;
  return logout(req);
};
var loader5 = async () => {
  return (0, import_node6.redirect)("/");
};

// route:/workspaces/remix-dnd-online/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react11 = require("@remix-run/react");
function Index() {
  const user = useOptionalUser();
  return /* @__PURE__ */ React.createElement("main", {
    className: "relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative sm:pb-16 sm:pt-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto max-w-7xl sm:px-6 lg:px-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative shadow-xl sm:overflow-hidden sm:rounded-2xl"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "absolute inset-0"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "h-full w-full object-cover",
    src: "https://user-images.githubusercontent.com/1500684/157774694-99820c51-8165-4908-a031-34fc371ac0d6.jpg",
    alt: "Sonic Youth On Stage"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "block uppercase text-yellow-500 drop-shadow-md"
  }, "Indie Stack")), /* @__PURE__ */ React.createElement("p", {
    className: "mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl"
  }, "Check the README.md file for instructions on how to get this project deployed."), /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center"
  }, user ? /* @__PURE__ */ React.createElement(import_react11.Link, {
    to: "/characters",
    className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
  }, "View Characters for ", user.email) : /* @__PURE__ */ React.createElement("div", {
    className: "space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0"
  }, /* @__PURE__ */ React.createElement(import_react11.Link, {
    to: "/join",
    className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
  }, "Sign up"), /* @__PURE__ */ React.createElement(import_react11.Link, {
    to: "/login",
    className: "flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600  "
  }, "Log In"))), /* @__PURE__ */ React.createElement("a", {
    href: "https://remix.run"
  }, /* @__PURE__ */ React.createElement("img", {
    src: "https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg",
    alt: "Remix",
    className: "mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
  }))))), /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mt-6 flex flex-wrap justify-center gap-8"
  }, [
    {
      src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
      alt: "Fly.io",
      href: "https://fly.io"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg",
      alt: "SQLite",
      href: "https://sqlite.org"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
      alt: "Prisma",
      href: "https://prisma.io"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
      alt: "Tailwind",
      href: "https://tailwindcss.com"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
      alt: "Cypress",
      href: "https://www.cypress.io"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
      alt: "MSW",
      href: "https://mswjs.io"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
      alt: "Vitest",
      href: "https://vitest.dev"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
      alt: "Testing Library",
      href: "https://testing-library.com"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
      alt: "Prettier",
      href: "https://prettier.io"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
      alt: "ESLint",
      href: "https://eslint.org"
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
      alt: "TypeScript",
      href: "https://typescriptlang.org"
    }
  ].map((img) => /* @__PURE__ */ React.createElement("a", {
    key: img.href,
    href: img.href,
    className: "flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
  }, /* @__PURE__ */ React.createElement("img", {
    alt: img.alt,
    src: img.src
  })))))));
}

// route:/workspaces/remix-dnd-online/app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action4,
  default: () => LoginPage,
  loader: () => loader6,
  meta: () => meta2
});
var import_node7 = require("@remix-run/node");
var import_react12 = require("@remix-run/react");
var React3 = __toESM(require("react"));
var loader6 = async ({ context: context2 }) => {
  const { req } = context2;
  const userId = await getUserId(req);
  if (userId)
    return (0, import_node7.redirect)("/");
  return (0, import_node7.json)({});
};
var action4 = async ({ context: context2 }) => {
  const { req } = context2;
  const { email, password, remember, redirectTo } = req.body;
  const safeRedirectTo = safeRedirect(redirectTo, "/");
  if (!validateEmail(email)) {
    return (0, import_node7.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string" || password.length === 0) {
    return (0, import_node7.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node7.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const { user, accessToken } = await authUser(email, password);
  if (!user) {
    return (0, import_node7.json)({ errors: { email: "Invalid email or password" } }, { status: 400 });
  }
  return createUserSession({
    request: req,
    userId: user._id,
    token: accessToken,
    remember: remember === "on" ? true : false,
    redirectTo: safeRedirectTo
  });
};
var meta2 = () => {
  return {
    title: "Login"
  };
};
function LoginPage() {
  var _a, _b, _c, _d;
  const [searchParams] = (0, import_react12.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") || "/characters";
  const actionData = (0, import_react12.useActionData)();
  const emailRef = React3.useRef(null);
  const passwordRef = React3.useRef(null);
  React3.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) {
      (_d2 = passwordRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React3.createElement("div", {
    className: "flex min-h-full flex-col justify-center"
  }, /* @__PURE__ */ React3.createElement("div", {
    className: "mx-auto w-full max-w-md px-8"
  }, /* @__PURE__ */ React3.createElement(import_react12.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React3.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React3.createElement("input", {
    ref: emailRef,
    id: "email",
    required: true,
    autoFocus: true,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? true : void 0,
    "aria-describedby": "email-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React3.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React3.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "current-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? true : void 0,
    "aria-describedby": "password-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React3.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React3.createElement("button", {
    type: "submit",
    className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Log in"), /* @__PURE__ */ React3.createElement("div", {
    className: "flex items-center justify-between"
  }, /* @__PURE__ */ React3.createElement("div", {
    className: "flex items-center"
  }, /* @__PURE__ */ React3.createElement("input", {
    id: "remember",
    name: "remember",
    type: "checkbox",
    className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  }), /* @__PURE__ */ React3.createElement("label", {
    htmlFor: "remember",
    className: "ml-2 block text-sm text-gray-900"
  }, "Remember me")), /* @__PURE__ */ React3.createElement("div", {
    className: "text-center text-sm text-gray-500"
  }, "Don't have an account?", " ", /* @__PURE__ */ React3.createElement(import_react12.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/join",
      search: searchParams.toString()
    }
  }, "Sign up"))))));
}

// route:/workspaces/remix-dnd-online/app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action5,
  default: () => Join,
  loader: () => loader7,
  meta: () => meta3
});
var import_node8 = require("@remix-run/node");
var import_react13 = require("@remix-run/react");
var React4 = __toESM(require("react"));
var loader7 = async ({ context: context2 }) => {
  const { req } = context2;
  const userId = await getUserId(req);
  if (userId)
    return (0, import_node8.redirect)("/");
  return (0, import_node8.json)({});
};
var action5 = async ({ context: context2 }) => {
  const { req } = context2;
  const { email, password, redirectTo } = req.body;
  const safeRedirectTo = safeRedirect(redirectTo, "/");
  if (!validateEmail(email)) {
    return (0, import_node8.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string" || password.length === 0) {
    return (0, import_node8.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node8.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const { user, accessToken } = await createAndAuthUser(email, password);
  return createUserSession({
    request: req,
    userId: user._id,
    token: accessToken,
    remember: false,
    redirectTo: safeRedirectTo
  });
};
var meta3 = () => {
  return {
    title: "Sign Up"
  };
};
function Join() {
  var _a, _b, _c, _d, _e;
  const [searchParams] = (0, import_react13.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") ?? void 0;
  const actionData = (0, import_react13.useActionData)();
  const feathers = useFeathers();
  const emailRef = React4.useRef(null);
  const passwordRef = React4.useRef(null);
  React4.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) {
      (_d2 = passwordRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React4.createElement("div", {
    className: "flex min-h-full flex-col justify-center"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "mx-auto w-full max-w-md px-8"
  }, /* @__PURE__ */ React4.createElement(import_react13.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React4.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React4.createElement("input", {
    ref: emailRef,
    id: "email",
    required: true,
    autoFocus: true,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? true : void 0,
    "aria-describedby": "email-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React4.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React4.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React4.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "new-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? true : void 0,
    "aria-describedby": "password-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React4.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React4.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React4.createElement("button", {
    type: "submit",
    className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Create Account"), ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.general) && /* @__PURE__ */ React4.createElement("div", {
    className: "pt-1 text-red-700",
    id: "general-error"
  }, actionData.errors.general), /* @__PURE__ */ React4.createElement("div", {
    className: "flex items-center justify-center"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "text-center text-sm text-gray-500"
  }, "Already have an account?", " ", /* @__PURE__ */ React4.createElement(import_react13.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/login",
      search: searchParams.toString()
    }
  }, "Log in"))))));
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { "version": "4a69f61f", "entry": { "module": "/build/entry.client-KAATVYK5.js", "imports": ["/build/_shared/chunk-UL2U57VX.js", "/build/_shared/chunk-XV23MX66.js"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "module": "/build/root-JQFL5O34.js", "imports": ["/build/_shared/chunk-JYIG5H2Y.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/characters": { "id": "routes/characters", "parentId": "root", "path": "characters", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/characters-H7HKJQLE.js", "imports": ["/build/_shared/chunk-DIJWCWKZ.js", "/build/_shared/chunk-F3GOFTVM.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/characters/$noteId": { "id": "routes/characters/$noteId", "parentId": "routes/characters", "path": ":noteId", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/characters/$noteId-P7Y45CTJ.js", "imports": ["/build/_shared/chunk-GCJCI353.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": true, "hasErrorBoundary": true }, "routes/characters/index": { "id": "routes/characters/index", "parentId": "routes/characters", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/characters/index-R6OLVJM5.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/characters/new": { "id": "routes/characters/new", "parentId": "routes/characters", "path": "new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/characters/new-WBZADYPM.js", "imports": ["/build/_shared/chunk-GCJCI353.js"], "hasAction": true, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/healthcheck": { "id": "routes/healthcheck", "parentId": "root", "path": "healthcheck", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/healthcheck-OGHP2PZR.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/index-7EZ4RI5W.js", "imports": ["/build/_shared/chunk-DIJWCWKZ.js"], "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/join": { "id": "routes/join", "parentId": "root", "path": "join", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/join-6RVJICDR.js", "imports": ["/build/_shared/chunk-EFMNTHSK.js", "/build/_shared/chunk-DIJWCWKZ.js", "/build/_shared/chunk-F3GOFTVM.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/login-6U4DB7SB.js", "imports": ["/build/_shared/chunk-EFMNTHSK.js", "/build/_shared/chunk-DIJWCWKZ.js", "/build/_shared/chunk-F3GOFTVM.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/logout-VK3MO2ZL.js", "imports": void 0, "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false } }, "url": "/build/manifest-4A69F61F.js" };

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/characters": {
    id: "routes/characters",
    parentId: "root",
    path: "characters",
    index: void 0,
    caseSensitive: void 0,
    module: characters_exports
  },
  "routes/characters/$noteId": {
    id: "routes/characters/$noteId",
    parentId: "routes/characters",
    path: ":noteId",
    index: void 0,
    caseSensitive: void 0,
    module: noteId_exports
  },
  "routes/characters/index": {
    id: "routes/characters/index",
    parentId: "routes/characters",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: characters_exports2
  },
  "routes/characters/new": {
    id: "routes/characters/new",
    parentId: "routes/characters",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
module.exports = __toCommonJS(stdin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
//# sourceMappingURL=index.js.map
