import Sidebar from './Sidebar';

export default {
raw: () => (
  <Sidebar
    rooms={['Room1', 'Room2', 'Room3']}
    onCreateRoom={() => console.log('Room created!')}/>
),
inDiv: () => (
  <div style={{width: '150px', height: '95vh'}}>
  <Sidebar
    rooms={['Room1', 'Room2', 'Room3']}
    onCreateRoom={() => console.log('Room created!')}/>
  </div>
)
}
