import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import { Home } from './components/Home';
import { Test } from './components/Test';

import './App.css';

function App() {


  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
