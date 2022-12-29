import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthState, setUserLogin } from '../redux/authSlice';

import './login.css'


export default function Login() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userId, setUserId] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const isLoggedIn: boolean = useSelector((state: AuthState) => state.isLoggedIn);
    // const userId: string = useSelector((state: AuthState) => state.userId);

    const checkIfLoggedIn = async () => {
        const resp = await fetch('/auth/profile');
        const data = await resp.json();
        if (resp.ok) {
            console.log(data);
            setIsLoggedIn(true);
            setUserId(data.username);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    const handleSubmit = async (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        const body = {
            username: username,
            password: password
        };

        const resp = await fetch('/auth/login', {
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

        const respData = await resp.json();
        if (resp.ok) {
            dispatch(setUserLogin(respData.username))
            setSuccess(true);
        }else {
            setError(respData);
            setSuccess(false);
        }
    };

    useEffect(() => {
        if (!error) return;
        
        navigate('/error', { state: { errorMsg: error }} );
    }, [error])

    if (isLoading) {
        return <div>
            LOADING
        </div>
    }


    if (isLoggedIn) {
        return (<div>
            <p>{userId}</p>
        </div>)
    }else {
        if (success) {
            return (<div>
                LOGIN WAS SUCCESSFUL
            </div>)
        }else {
            return (
                <div>
                    <form onSubmit={handleSubmit}>
                        <h1>LOGIN</h1>
                        <div className="input-container">
                            <label>Username</label>
                                <input type="text" name="username" required onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                                <input type="password" name="password" required onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="button-container">
                            <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>
            );
        }
    }

    
}
