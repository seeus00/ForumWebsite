import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState, setUserLogin } from '../redux/authSlice';

import './login.css'


export default function Login() {
    const [isLoading, setIsLoading] = useState(true);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userId, setUserId] = useState('');

    const dispatch = useDispatch();

    // const isLoggedIn: boolean = useSelector((state: AuthState) => state.isLoggedIn);
    // const userId: string = useSelector((state: AuthState) => state.userId);

    const checkIfLoggedIn = async () => {
        const resp = await fetch('/auth/profile');
        if (resp.ok) {
            const data = await resp.json();
            console.log(data);
            setIsLoggedIn(true);
            setUserId(data.username);
        }else {
            console.log(resp);
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

        if (resp.ok) {
            const respData = await resp.json();
            dispatch(setUserLogin(respData.username))
            setSuccess(true);
        }
    };

    if (isLoading) {
        return <div>
            <img src={require('../assets/loading.webp')} id="loading" alt='LOADING'></img>
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
