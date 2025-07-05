import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import { io } from 'socket.io-client';

export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const socket = io(backendURL);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/note/:id" element={<Editor />} />
    </Routes>
  );
}

export default App;