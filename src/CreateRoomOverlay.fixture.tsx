import CreateRoomOverlay from './CreateRoomOverlay';

export default () => (
  <CreateRoomOverlay onSubmitRoomCreator={(room: string) => console.log(room)}/>
)
