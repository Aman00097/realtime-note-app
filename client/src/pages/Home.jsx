import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendURL } from '../App';

function Home() {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState([]);
    const [collaborators, setCollaborators] = useState({});
    const navigate = useNavigate();

    const fetchNotes = async () => {
        const res = await axios.get(`${backendURL}/notes`);
        setNotes(res.data);
    };

    const fetchLiveCounts = async () => {
        try {
            const res = await axios.get(`${backendURL}/live-collaborators`);
            setCollaborators(res.data || {});
        } catch (err) {
            console.error('Error fetching collaborator counts:', err);
        }
    };

    useEffect(() => {
        fetchNotes();
        fetchLiveCounts();
        const interval = setInterval(fetchLiveCounts, 3000);
        return () => clearInterval(interval);
    }, []);

    const createNote = async () => {
        if (!title.trim()) return;
        const res = await axios.post(`${backendURL}/notes`, { title });
        setTitle('');
        await fetchNotes();
        navigate(`/note/${res.data._id}`);
    };

    const deleteNote = async (id) => {
        if (!confirm('Are you sure?')) return;
        await axios.delete(`${backendURL}/notes/${id}`);
        await fetchNotes();
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Create a New Note Room</h2>
            <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={createNote}>Create</button>

            <h3 style={{ marginTop: '2rem' }}>Note Rooms</h3>
            {notes.length === 0 ? (
                <p>No rooms yet</p>
            ) : (
                <table border="1" cellPadding="10" style={{ marginTop: '1rem', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Last Updated</th>
                            <th>Collaborators</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note) => (
                            <tr key={note._id}>
                                <td>{note.title}</td>
                                <td>{new Date(note.updatedAt).toLocaleTimeString()}</td>
                                <td>{collaborators[note._id] || 0}</td>
                                <td>
                                    <button onClick={() => navigate(`/note/${note._id}`)}>Join</button>
                                    <button onClick={() => deleteNote(note._id)} style={{ marginLeft: '8px', color: 'red' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Home;