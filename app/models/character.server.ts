import { client } from "~/feathers.server";
/**
 *Important to note that using rest services don't emit real time events...
 * Should try really hard to get all this to work with a socket connection
 */
// GET /character/:id
export async function getCharacter(id: string) {
    return client.service('characters').get(id);
};
// GET /character
export async function getCharactersByUser() {
    return client.service('characters').find()
};
// change this to use a character interface
export async function createCharacter(character: object) {
    return client.service('characters').create({character});
};
// DELETE /character/:id
export async function deleteCharacter(id: string) {
    return client.service('characters').remove(id);
}