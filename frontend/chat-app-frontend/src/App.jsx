import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import JoinRoomPage from './pages/JoinRoomPage.jsx'
import { useState } from 'react';
import {io} from "socket.io-client"
import ChatRoomPage from './pages/ChatPage.jsx';


const socket = io('http://localhost:4000');
function App() {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');


  return (

    <Router>
      <div className='App'>
        <Routes>
          <Route 
            path='/' 
            element={
              <JoinRoomPage 
                username={userName}
                setUsername={setUserName}
                room={room}
                setRoom={setRoom}
                socket={socket}  
              />} 
          />
          <Route
            path='/chat'
            element={
              <ChatRoomPage 
                username={userName} 
                room={room} 
                socket={socket} 
              />
            }
          />
        </Routes>
      </div>
  </Router>
  )
}

export default App