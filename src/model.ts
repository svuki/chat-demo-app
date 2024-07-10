import { create } from 'zustand'
import { IMessage } from './Composer';
import { devtools } from 'zustand/middleware'
import { loadRooms, loadMessages, sendMessage, createRoom, registerChangesListener } from './storage'

export interface AppState {
  messages: Array<IMessage>,
  rooms: Array<string>,
  room: string,
  user: string,
  roomMessagesListener: null | (() => void),
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

async function onRoomEnter(room: string, state: AppState) {
  let messages = await loadMessages(room);
  console.log(state)
  if (state.roomMessagesListener === null) {}
  else {
    console.log(state.roomMessagesListener);
    state.roomMessagesListener()
  }
  // @ts-ignore
  let newListener = registerChangesListener(function(doc) {
    if (doc.type !== 'message') {
      return
    }
    state.onNewMessageToRoom(doc)
  })

  return { room, messages, roomMessagesListener: newListener }
}

const useAppStore = create<AppState>()(
  devtools(
    (set, get) => (
      {
	messages: [],
	rooms: [],
	room: 'default',
	roomMessagesListener: null,
	user: generateRandomString(10),
	onNewMessageToRoom: (message: IMessage) => set((state) => ({messages: [...state.messages, message]})),
	onNewRooms: (rooms: Array<string>) => {
	  set((state) => {
	    let newRooms = rooms.filter((r) => state.rooms.find((x) => x == r) === undefined);
	    return {rooms: [...state.rooms, ...newRooms]}
	  })
	},
	onEnterRoom: async (room: string) => {
	  set(await onRoomEnter(room, get()))
	},
	enterRoomCreator: () => set(() => ({createRoomOverlay: true})),
	exitRoomCreator: () => set(() => ({createRoomOverlay: false})),
	submitRoomCreator: async (room: string) => {
	  await createRoom(room)
	  set(() => ({createRoomOverlay: false}))
	},
	createRoomOverlay: false
      }
    )
  )
)


export default useAppStore;
