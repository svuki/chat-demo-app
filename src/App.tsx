import './App.css';
import ChatView from './ChatView'
import useAppStore, { AppState, HistoryAction } from './model'
import { sendMessage } from './storage'

export function ChatApp() {
  const store = useAppStore((state: AppState) => state);
  
  const props = {
    onEnterRoom: (room: string) => store.onEnterRoom(room, HistoryAction.PUSH),
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


export default function App() {
  return (
    <ChatApp/>
  ) 
}
