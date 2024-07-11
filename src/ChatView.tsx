import Composer, { IMessage } from './Composer';
import Messages, { IMessageProps } from './Messages';
import Sidebar from './Sidebar';
import CreateRoomOverlay from './CreateRoomOverlay';
import './ChatView.css';

interface IChatViewProps {
  onEnterRoom: (room: string) => void,
  messages: Array<IMessageProps>,
  onMessage: (message: IMessage) => void,
  rooms: Array<string>,
  room: string,
  user: string,
  onCreateRoom: () => void,
  onSubmitRoomCreator: (room: string) => Promise<void>,
  createRoomOverlay: boolean
}

export default function ChatView(props: IChatViewProps) {
  if (!(props.rooms.find(x => x === props.room))) {
    return (
      <div className='chatView'>
	<div className='chatSidebar'>
	  <Sidebar {...props} />
	</div>
	<div className='chatArea'>
	  <p>{`Woops! The chat room ${props.room} does not exist.`}</p>
	</div>
	{props.createRoomOverlay && <CreateRoomOverlay {...props} />}
      </div>
    )
  }
  return (
    <div className='chatView'>
      <div className='chatSidebar'>
	<Sidebar {...props} />
      </div>
      <div className='chatArea'>
	<Messages {...props} />
	<Composer {...props} />
      </div>
      {props.createRoomOverlay && <CreateRoomOverlay {...props} />}
    </div>
  )
}
