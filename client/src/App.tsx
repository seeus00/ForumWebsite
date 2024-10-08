import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";
import './App.css';
import Home from './components/home.component';
import Login from './components/login.component';
import Register from './components/register.component';
import Catalog from './components/catalog.component';
import ThreadCreation from './components/threadCreation.component';
import Post from './components/post.component';
import Reply from './components/reply.component';
import MusicPlayer from './components/musicPlayer.component';
import Error from './components/error.component';

export default function App() {
  return (
    <div className='App'>
			<div className='header'>
					<table>
							<tr>
									<td colSpan={2} className='banner'>
											<h1>
													LEE FORUMS
											</h1>
									</td>
							</tr>
							<tr>
									<td>
										<a href='/catalog'>CATALOG</a>
									</td>
									<td>
										<a href='/login'>LOGIN</a>
									</td>
									<td>
										<a href='/register'>REGISTER</a>
									</td>
							</tr>
					</table>

			</div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/home" element={<Home/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>
					<Route path="/catalog" element={<Catalog/>}/>
					<Route path="/error" element={<Error/>}/>
					<Route path="/threadCreate" element={<ThreadCreation/>}/>
					<Route path="/thread/:threadId" element={<Post/>}/>
					<Route path="/reply" element={<Reply/>}/>
				</Routes>
			</BrowserRouter>
			<MusicPlayer/>
    </div>
  );
}
