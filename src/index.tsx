import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadRooms, registerChangesListener } from './storage';
import useAppState, { HistoryAction } from './model';

// Initial data loads
// Note: because we aren't in a component, we have to use the .getState() method
// on the zustand data store
loadRooms().then((rooms) => useAppState.getState().onNewRooms(rooms))

// Register the rooms listener
// @ts-ignore
registerChangesListener(function(doc) {
  if (doc.type !== 'room') {
    return
  }
  // Like before: outside component => need to use getState()
  useAppState.getState().onNewRooms([doc.name])
})

// Simulate entering the default room
useAppState.getState().onEnterRoom('default', HistoryAction.REPLACE);

window.addEventListener('popstate', (e) => {
  console.log(e)
  let room = e.state.room;
  if (room != null) {
    useAppState.getState().onEnterRoom(room, HistoryAction.BACKTRACK)
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
