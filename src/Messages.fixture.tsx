import Messages from './Messages';

export default () => {
  let messages = [
    {_id: "1", content: "message1", sender: "sender1"},
    {_id: "2", content: "message2", sender: "sender1"},
    {_id: "3", content: "I am another sender", sender: "sender2"}
  ]
  return <Messages messages={messages}/>
}


