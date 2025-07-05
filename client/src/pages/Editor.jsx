import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { backendURL, socket } from '../App';
import axios from 'axios';

function Editor() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [collaborators, setCollaborators] = useState(0);

    useEffect(() => {
        socket.emit('join-note', id);

        axios.get(`${backendURL}/notes/${id}`).then((res) => {
            setTitle(res.data.title || '');
            setContent(res.data.content || '');
        });

        socket.on('receive-changes', (newContent) => {
            setContent(newContent);
        });

        socket.on('collaborators-count', ({ noteId, count }) => {
            if (noteId === id) {
                setCollaborators(count);
            }
        });

        return () => {
            socket.off('collaborators-count');
            socket.off('receive-changes');
        };
    }, [id]);

    const handleChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        socket.emit('send-changes', { noteId: id, content: newContent });
        socket.emit('save-note', { noteId: id, content: newContent });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Note Room: {id}</h2>
            <h3>Title: {title}</h3>
            <p>👥 Collaborators: {collaborators}</p>
            <textarea
                style={{ width: '100%', height: '300px' }}
                value={content}
                onChange={handleChange}
            />
        </div>
    );
}

export default Editor;