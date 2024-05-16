import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, Route  } from 'react-router-dom';
import '../Styling/Navbar.css';
import { useAuth } from '../Util/AuthProvider';

const Navbar=()=> {
  const { setToken } = useAuth();
  const handleClick = () => {
    console.log('Button clicked!');
    setToken("");
  };
  
   return (
      <nav className="nav-container">
        <Link to="/"><div className="logo">Smart-Pot</div></Link>
        <Link to="/login"><button type="button" className="login-button" onClick={handleClick}> Logout</button></Link>
      </nav>
    );


}

export default Navbar



