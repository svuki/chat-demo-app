import { useState } from 'react';
import './CreateRoomOverlay.css';

interface ICreateRoomOverlayProps {
  onSubmitRoomCreator: (room: string) => void;
}

export default function CreateRoomOverlay({ onSubmitRoomCreator }: ICreateRoomOverlayProps) {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRoomCreator(roomName);
  };

  return (
    <div className="screenOverlay">
      <div className="createRoomFormContainer">
        <form className="createRoomForm" onSubmit={handleSubmit}>
          <label>
            Room Name:
            <input 
              type="text" 
              value={roomName} 
              onChange={(e) => setRoomName(e.target.value)} 
            />
          </label>
          <button type="submit">Create Room</button>
        </form>
      </div>
    </div>
  );
}
