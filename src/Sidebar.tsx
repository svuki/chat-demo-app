// RoomList is the sidebar that show the user all available rooms
import { Link } from 'react-router-dom';
import './Sidebar.css';

interface ISidebarProps {
  rooms: Array<string>,
  onEnterRoom: (room: string) => void,
  onCreateRoom: () => void
}

export default function Sidebar({ rooms, onCreateRoom, onEnterRoom }: ISidebarProps) {
  return (
    <div className="sidebar">
      {rooms.map((room) => <a key={room} onClick={() => onEnterRoom(room)}>{room}</a>)}
      <button onClick={() => onCreateRoom()}>Create New Room</button>
    </div>
  );
}

