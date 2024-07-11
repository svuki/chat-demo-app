import ChatView from './ChatView';
import { IMessage } from './Composer';

let messages = [
  {_id: "1", content: "message1", sender: "user1"},
  {_id: "2", content: "message2", sender: "user2"}
]
let props = {
  messages,
  onEnterRoom: (room: string) => console.log('entering room', room),
  onMessage: (message: IMessage) => console.log(message),
  rooms: ['DefaultRoom', 'OtherRoom', 'YetAnotherRoom'],
  room: 'DefaultRoom',
  user: 'stefanv',
  onSubmitRoomCreator: async (room: string) => console.log('room created'),
  onCreateRoom: () => console.log('room create clicked'),
  createRoomOverlay: false
}

export default {
  default: () => {
    return (
      <div style={{height: "98vh"}}>
	<ChatView {...props}/>
      </div>
    )
  },
  createRoomOverlay: () => {
    let overlayProps = {...props, ...{createRoomOverlay: true}}
    return (
      <div style={{height: "98vh"}}>
	<ChatView {...overlayProps}/>
      </div>
    )
  },   
}
