import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PouchDB from 'pouchdb';
import { create } from 'zustand'
import pouchDBFind from 'pouchdb-find';
import { RouterProvider, createBrowserRouter, Link, useParams, Navigate, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { myFunction } from './utils';

PouchDB.plugin(pouchDBFind);

interface AppState {
  name: string,
  rooms: Array<string>,
  currentRoom: string,
  addRoom: (room: string) => void
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

const pouchDB = new PouchDB('store');
pouchDB.createIndex({index: {fields: ['room', 'type']}})


// Our zustand app store stores state our components rely on
const useAppStore = create<AppState>()(
  (set) => (
    {
      name: generateRandomString(5),
      currentRoom: 'AnythingGoes',
      rooms: ['AnythingGoes', 'Beginners', 'The X-Men'],
      addRoom: (room: string) => set((state: AppState) => ({ rooms: state.rooms.concat([room]) }))
    }
  )
)

// The ChatRoom is the list of all messages
function ChatRoom() {
  const { roomName } = useParams()
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      const result = await pouchDB.find({ selector: { room: roomName } });
      // @ts-ignore
      setMessages(result.docs);
    };

    fetchMessages();

    const changes = pouchDB
      .changes({
        since: 'now',
        live: true,
        include_docs: true,
        selector: { room: roomName }
      })
      .on('change', change => {
	// @ts-ignore
        if (change.doc && change.doc.room === roomName) {
	// @ts-ignore
          setMessages(prevMessages => [...prevMessages, change.doc]);
        }
      });

    return () => {
      changes.cancel();
    };
  }, [roomName]);

  return (
    <div className="chatroom">
      {messages.map((message: any) => <p>{`${message.sender}: ${myFunction()} ${message.content}`}</p>)}
    </div>
  );
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

// The MessageComposer is where users compose and send messages
export function MessageComposer({user }: {user: string}) {
  const { roomName } = useParams();
  const [message, setMessage] = useState('');
  // @ts-ignore
    const handleChange = (e) => {
    // @ts-ignore
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    // Handle message submission logic here
    console.log(message);
    const messageDocument = {
      _id: uuidv4(),
      content: message,
      sender: user,
      room: roomName
    }
    console.log(messageDocument);
    pouchDB.put(messageDocument);
    setMessage('');
  };

  return (
    <div className="messageComposer">
      <textarea
	className="textInput"
        value={message}
        onChange={handleChange}
        placeholder="Type your message here..."
      />
      <button onClick={handleSubmit}>
        Send
      </button>
    </div>
  );
}

// RoomList is the sidebar that show the user all available rooms
function RoomList() {
  const rooms = useAppStore((state) => state.rooms);
  const navigate = useNavigate();

  const handleCreateNewRoom = () => {
    navigate(`${window.location.pathname}?createNewRoom=true`);
  };

  return (
    <div className="roomsList">
      {rooms.map((room) => <Link key={room} to={`/${room}`}>{room}</Link>)}
      <button onClick={handleCreateNewRoom}>Create New Room</button>
    </div>
  );
}

// The overlay component can be used to add additional rooms
// @ts-ignore
function Overlay({ onClose }) {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = () => {
    // Handle room creation logic here
    onClose();
  };

  return (
    <div className="overlay">
      <div className="overlayForm">
	<input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
	/>
	<button onClick={handleSubmit}>Create</button>
	<button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// The ChatView is the main App
function ChatView() {
  const user = useAppStore((state) => state.name);

  // Either we are showing the main app & chat screen or an overlay form. We decide
  // what to show based on the search params.
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    if (searchParams.get('createNewRoom')) {
      setOverlayVisible(true);
    }
  }, [searchParams]);
  useEffect(() => {
    if (!searchParams.get('createNewRoom')) {
      setOverlayVisible(false);
    }
  }, [location]);


  const handleCloseOverlay = () => {
    setOverlayVisible(false);
    searchParams.delete('createNewRoom');
    setSearchParams(searchParams);
  };

  return (
    <div className="chat">
      <RoomList/>
      <div className="mainscreen">
        <ChatRoom/>
        <MessageComposer user={user}/>
      </div>
      {isOverlayVisible && <Overlay onClose={handleCloseOverlay} />}
    </div>
  );
}

// The browser element controls the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/AnythingGoes"/>
  },
  {
    path: "/:roomName",
    element: <ChatView />
  }
])

// Our main app is just the router
const App = () => <RouterProvider router={router} />

export default App;
