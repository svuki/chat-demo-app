// RoomList is the sidebar that show the user all available rooms
import { Link } from 'react-router-dom';
import './Sidebar.css';

interface ISidebarProps {
  rooms: Array<string>,
  onCreateRoom: () => void
}

export default function Sidebar({ rooms, onCreateRoom }: ISidebarProps) {
  return (
    <div className="sidebar">
      {rooms.map((room) => <Link key={room} to={`/${room}`}>{room}</Link>)}
      <button onClick={() => onCreateRoom()}>Create New Room</button>
    </div>
  );
}

