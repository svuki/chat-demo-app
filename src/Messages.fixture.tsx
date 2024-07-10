import Messages from './Messages';

export default () => {
  let messages = [
    {content: "message1", sender: "sender1"},
    {content: "message2", sender: "sender1"},
    {content: "I am another sender", sender: "sender2"}
  ]
  return <Messages messages={messages}/>
}


