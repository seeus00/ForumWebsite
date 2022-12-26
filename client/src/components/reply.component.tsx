import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { JsxElement } from 'typescript';

import './reply.css';

export default function Reply() {
    const [replyContent, setReplyContent] = useState('');
    const [respMessage, setRespMessage] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const post = location.state;

    const handleSubmit = async () => {
        const body = {
            parentId: post.id,
            postContent: replyContent,
            threadId: post.threadId
        }

        const resp = await fetch('/api/createPost', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            'headers': {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body)
        });

        const data = await resp.json();
        setRespMessage(data);
        
        navigate('/thread/' + post.threadId);
    }

    return (<div>
        <div className='post'>
                <div className='postUsername'>
                    <span>{post.username} | {post.dateCreated}</span>
                </div>
                <div className='postBody'>
                    <span>{post.content}</span>
                </div>
                <div className='inputContainer'>
                    <textarea name="replyArea" cols={100} rows={20} required onChange={(e) => setReplyContent(e.target.value)}/>
                </div>
                <button className='replyButton' onClick={() => handleSubmit()}>Submit</button>
            </div>
    </div>);
}