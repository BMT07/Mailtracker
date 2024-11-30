import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from "./App"
import { UserSpace } from './components/UserSpace/UserSpace';
import "./input.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/UserSpace/Login';
import { Signup } from './components/UserSpace/Signup';
import { Error404 } from './components/404Notfound';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/userSpace" element={<UserSpace />} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="*" element={<Error404 />} />
  </Routes>
</Router>
);

