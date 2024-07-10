import { useState } from 'react';
import { uuidv4 } from './utils';


export interface IMessage {
  _id: string,
  type: string,
  content: string,
  sender: string,
  room: string
}

  
export default function Composer({user, room, onMessage}: {user: string, room: string, onMessage: (message: IMessage) => void}) {
  const [message, setMessage] = useState('');
  // @ts-ignore
  const handleChange = (e) => {
    // @ts-ignore
    setMessage(e.target.value);
  };
  
  const handleSubmit = () => {
    const messageDocument = {
      _id: uuidv4(),
      content: message,
      sender: user,
      type: 'message',
      room: room
    }
    console.log(onMessage);
    onMessage(messageDocument);
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
