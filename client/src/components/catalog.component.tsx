import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '../redux/authSlice';

import './catalog.css';


interface ThreadObj {
    id: string,
    title: string,
    content: string,
    dateCreated: string,
    userId: string,
    username: string
}

interface ThreadsObj {
    threadCount: number,
    threads: Array<ThreadObj>
}

export default function Catalog() {
    const [threadData, setThreadData] = useState<ThreadsObj>();

    const navigate = useNavigate();

    const createThread = async () => {
        const resp = await fetch('/auth/profile');
        if (resp.ok) {
            navigate("/threadCreate");
        }else {
            alert("You need to be logged in to post!");
        }
    }

    useEffect(() => {
        const getThreads = async () => {
            const resp = await fetch('/api/getThreads');
            if (resp.ok) {
                const data = await resp.json();
                setThreadData(data);
            }
        }

        getThreads();
    }, []);

    const generateThreadTable = (): any => {
        if (!threadData) return "";
        return threadData.threads.map((thread, i) => {
            return (
                <React.Fragment key={thread.id} >
                    <tr>
                        <td rowSpan={3} className='index title'>
                            <span className='spanText'>{i + 1}. </span>
                        </td>
                        <td>
                            <span className='spanText'>{thread.title}</span>
                        </td>
                    </tr>
                    <tr className='space'></tr>
                    <tr>
                        <td className='date'>
                            <span className='otherInfo'>Created: {thread.dateCreated} | </span>
                        </td>
                        <td >
                            <span className='otherInfo'>By {thread.username}</span>
                        </td>
                    </tr>
                </React.Fragment>
                
            )
        });
    }


    return (<div>
        <h1>
            CATALOG
        </h1>

        <button onClick={createThread}>CREATE POST</button>

        {threadData ? 
            <div className='threads'>
                <table className='threadTable'>
                    <tbody className='threadBody'>
                        {generateThreadTable()}
                    </tbody>
                    
                </table>
            </div>

            :

            ""
        }

        
        

   
        

    </div>)
}