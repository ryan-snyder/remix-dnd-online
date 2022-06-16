import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { client } from "~/feathers.server";
export type { User } from "@prisma/client";
/**
 * TODO: Change all this to feathersjs operations
 */





export async function getUserById(id: User["id"], token: string) {
  console.log('Checking for token...');
  console.log(await client.authentication.getAccessToken());
  return client.service('users').get(id);
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}
/**
export async function createUser(email: string, password: string) {
  // create the request object
  const userRequest = new Request('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  //return createUseSipseaghyr(email, password);
  //make a http post request to the /users endpoint on feathers
  // the same as calling feathers.service('users').create(data)
  return await (await fetch(userRequest)).json();
}
*/

export async function createUser(email: string, password: string) {
  return client.service('users').create({email, password});
}

export async function authUser(email: string, password: string) {
  return client.authenticate({
    strategy: 'local',
    email,
    password
  });
}
export async function createAndAuthUser(email: string, password: string) {
  return await createUser(email, password).then(() => { return authUser(email, password);});
}
/**
export async function authUser(email: string, password: string) {
  const authRequest = new Request('http://localhost:3000/authentication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      strategy: "local",
      email,
      password
    })
  })

  return await (await fetch(authRequest)).json();
}


export async function createAndAuthUser(email: string, password: string) {
  const user = await createUser(email, password);
  const auth = await authUser(email, password);
  return {
    user,
    token: auth.accessToken
  }
}
*/
export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}