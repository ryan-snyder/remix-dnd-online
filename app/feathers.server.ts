import io from 'socket.io-client';
import feather from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';

// not sure about this stuff
// should this go into our root.tsx file? 
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

export default client;