import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import loading from '../assets/loading.webp';

import './threadCreation.css';

export default function ThreadCreation() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [threadTitle, setThreadTitle] = useState('');
    const [threadContent, setThreadContent] = useState('');

    const [respMessage, setRespMessage] = useState('');

    const navigate = useNavigate();


    //Check for authentication
    useEffect(() => {
        const checkAuth = async () => {
            const resp = await fetch('/auth/profile');
            if (resp.ok) {
                setIsLoggedIn(true);
            }else {
                setIsLoggedIn(false);
            }

            setIsLoading(false);
        }
        checkAuth();
       
    }, []);

    const delayRedirect = () => {
        setTimeout(() => navigate('/catalog'), 2000);
    };

    const handleSubmit = async (e: React.ChangeEvent<any>) => {
        e.preventDefault();

        const body = {
            threadTitle: threadTitle,
            threadContent: threadContent 
        }

        const resp = await fetch('/api/createThread', {
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
        delayRedirect();
    }



    if (isLoading) {
        return <div>
            <img src={loading} id="loading" alt='LOADING'></img>
        </div>
    }

    if (!isLoggedIn) {
        return (<div>
            <button onSubmit={() => navigate("/login")}>LOG IN</button>
        </div>)
    }

    if (respMessage) {
        return (<div>
            <p> {respMessage} </p>
        </div>)
    }else {
        return (<div>
            <h1>
                THREAD CREATION
            </h1>
            <form onSubmit={handleSubmit}>
                <div className='inputContainer'>
                    <label>Thread title: </label>
                    <input type="text" name="threadTitle" required onChange={(e) => setThreadTitle(e.target.value)} />
                </div>
    
                <div className='space'></div>
    
                <div className='inputContainer'>
                    <label>Thread content: </label>
                    <textarea name="threadContent" cols={100} rows={20} required onChange={(e) => setThreadContent(e.target.value)}/>
                </div>
    
                <div className="buttonContainer">
                    <input type="submit" value="Submit"/>
                </div>
            </form>
        </div>)
    }
}