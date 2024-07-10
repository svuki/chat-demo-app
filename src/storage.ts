import './App.css';
import PouchDB from 'pouchdb';
import pouchDBFind from 'pouchdb-find';
import { IMessage } from './Composer';

PouchDB.plugin(pouchDBFind);

const pouchDB = new PouchDB('store');
pouchDB.createIndex({index: {fields: ['room', 'type']}})

const defaultRoom = {
  type: 'room',
  name: 'default',
  _id: 'deafult'
}


export async function loadRooms(): Promise<Array<string>> {
  const result = await pouchDB.find({selector: {type: 'room'}})
  // @ts-ignore
  return [defaultRoom.name, ...(result.docs.map((document) => document.name))]
}

export async function loadMessages(room: string): Promise<Array<IMessage>> {
  const result = await pouchDB.find({selector: {type: 'message', room: room}})
  // @ts-ignore
  return result.docs
}

export function sendMessage(message: IMessage) {
  pouchDB.put(message)
}

export function createRoom(room: string) {
  return pouchDB.put({_id: room, type: 'room', name: room})
}

// @ts-ignore
export function registerChangesListener(handler) {
  const changes = pouchDB.changes(
    {
      since: 'now',
      live: true,
      include_docs: true
    }
  )
  changes.on('change', function(change) {
    handler(change.doc)
  })
  // Return the cancel function. Clients can call this to stop the listener.
  return () => changes.cancel()
}
