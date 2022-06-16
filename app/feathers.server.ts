import io from 'socket.io-client';
import feather from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';

import type {Application} from "@feathersjs/feathers";
const socket = io('http://localhost:3000');

const client = feather();

client.configure(socketio(socket));

client.configure(auth());

client.reAuthenticate().then(() => {
    console.log('Authenticated connection...');
}).catch((e) => {
    console.log('failed to authenticate but its fine');
    //if we get an error, check if we've got a token in our session storage
})
export { client };