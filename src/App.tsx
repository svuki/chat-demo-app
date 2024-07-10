import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PouchDB from 'pouchdb';
import { create } from 'zustand'
import pouchDBFind from 'pouchdb-find';
import { RouterProvider, createBrowserRouter, Link, useParams, Navigate, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import { IMessageProps } from './Messages';
import { IMessage } from './Composer';
import ChatView from './ChatView'
import { devtools } from 'zustand/middleware'

PouchDB.plugin(pouchDBFind);

const pouchDB = new PouchDB('store');
pouchDB.createIndex({index: {fields: ['room', 'type']}})

interface AppState {
  messages: Array<IMessageProps>,
  rooms: Array<string>,
  room: string,
  user: string,
  onNewMessageToRoom: (message: IMessage) => void,
  onNewRooms: (rooms: Array<string>) => void,
  onEnterRoom: (room: string) => Promise<void>,
  enterRoomCreator: () => void,
  exitRoomCreator: () => void,
  submitRoomCreator: (room: string) => Promise<void>,
  createRoomOverlay: boolean
}

  
function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

async function loadMessages(room: string): Promise<Array<IMessage>> {
  const result = await pouchDB.find({selector: {room: room}})
  // @ts-ignore
  return result.docs
}

const defaultRoom = {
  type: 'room',
  name: 'default',
  _id: 'deafult'
}

async function loadRooms() {
  const result = await pouchDB.find({selector: {type: 'room'}})
  // @ts-ignore
  return [defaultRoom.name, ...(result.docs.map((document) => document.name))]
}

function sendMessage(message: IMessage) {
  pouchDB.put(message)
}


const useAppStore = create<AppState>()(
  devtools(
    (set) => (
      {
	messages: [],
	rooms: [],
	room: 'default',
	user: generateRandomString(10),
	onNewMessageToRoom: (message: IMessage) => set((state) => ({messages: [...state.messages, message]})),
	onNewRooms: (rooms: Array<string>) => {
	  console.log('New rooms', rooms);
	  set((state) => {
	    let newRooms = rooms.filter((r) => state.rooms.find((x) => x == r) === undefined);
	    return {rooms: [...state.rooms, ...newRooms]}
	  })
	},
	onEnterRoom: async (room: string) => {
	  let messages = await loadMessages(room);
	  set((state) => ( { room, messages }))
	},
	enterRoomCreator: () => set(() => ({createRoomOverlay: true})),
	exitRoomCreator: () => set(() => ({createRoomOverlay: false})),
	submitRoomCreator: async (room: string) => {
	  await pouchDB.put({_id: room, type: 'room', name: room})
	  set(() => ({createRoomOverlay: false}))
	},
	createRoomOverlay: false
      }
    )
  )
)

export function ChatApp() {
  const store = useAppStore((state) => state);
  let { roomName } = useParams();

  useEffect(() => {
    console.log('room name is', roomName);
    if (roomName == null) {
      store.onEnterRoom('default')
    }
    else {
      store.onEnterRoom(roomName)
    }
  }, [roomName])

  // Effect which subscribes to new rooms
  useEffect(() => {
    const changes = pouchDB.changes({
      since: 'now',
      live: true,
      include_docs: true
    });
    changes.on('change', function(change) {
      let doc = change.doc;
      // @ts-ignore
      if (doc.type === 'room') {
	// @ts-ignore
	store.onNewRooms([doc.name])
      }
    })
    return () => changes.cancel()
  }, [])


  // Effect which subscribes to changes impacting the currentRoom
  useEffect(() => {
    // @ts-ignore
    function handleChange(doc) {
      if (doc.type === 'message' && doc.room === roomName) {
	console.log('received message to active room', doc)
	store.onNewMessageToRoom(doc)
      }
    }
    
    const changes = pouchDB.changes({
      since: 'now',
      live: true,
      include_docs: true,
    }).on('change', function(change) {
      // Your callback function
      handleChange(change.doc);
    }).on('error', function(err) {
      console.error('Error watching changes:', err);
    });

    return () => changes.cancel()
  }, [store.room])

  useEffect(() => {
    // @ts-ignore
    console.log('running loadRooms');
    loadRooms().then((rooms) => store.onNewRooms(rooms))
    
  }, [])
  
  const props = {
    messages: store.messages,
    onMessage: sendMessage,
    rooms: store.rooms,
    room: store.room,
    user: store.user,
    onCreateRoom: store.enterRoomCreator,
    onSubmitRoomCreator: store.submitRoomCreator,
    createRoomOverlay: store.createRoomOverlay
  }
  
  return (
    <div className="app">
      <ChatView {...props}/>
    </div>
  )
}


// The browser element controls the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatApp />
  },
  {
    path: "/:roomName",
    element: <ChatApp />
  }
])

export default function App() {
  
  return (
    <RouterProvider router={router} />
  )
  
}
