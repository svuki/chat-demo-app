import { IMessage } from './Composer';

export interface IMessageProps {
  content: string,
  sender: string,
  _id: string,
}

export interface IMessagesProps {
  messages: Array<IMessageProps>
}

function Message({ _id, content, sender}: IMessageProps) {
  let s = `${sender}: ${content}`;
  return <p>{s}</p>
}

export default function Messages({ messages }: IMessagesProps) {
  return (
    <div className="chatroom">
      {messages.map((message) => <Message key={message._id} {...message}/>)}
    </div>
  );
}

