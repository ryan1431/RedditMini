import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import { Home } from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
