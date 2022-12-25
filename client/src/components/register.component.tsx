import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './register.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        const body = {
            username: username,
            password: password
        };

        const resp = await fetch('/auth/register', {
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
            setSuccess(true);
        }
    };

    if (success) {
        return (<div>
            REGISTER WAS SUCCESSFUL!
        </div>)
    }else {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <h1>REGISTER</h1>
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
