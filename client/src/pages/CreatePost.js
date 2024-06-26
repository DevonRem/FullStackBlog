import ReactQuill from "react-quill";
import { useState } from "react";
import {Navigate} from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        const response = await fetch('https://fullstackblog-qane.onrender.com/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form onSubmit={createNewPost}>
            <input type="title" placeholder={'title'} value={title} onChange={ev=>setTitle(ev.target.value)}/>
            <input type="summary" placeholder={'summary'} value={summary} onChange={ev=>setSummary(ev.target.value)}/>
            <input type="file" onChange={ev=>setFiles(ev.target.files)}/>
            <ReactQuill value={content} onChange={ev=>setContent(ev)}/>
            <button style={{marginTop:'5px'}}>Create Post!</button>
        </form>
    )
}