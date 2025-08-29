import React, { useState, useEffect } from 'react';
import './css/navBar.css'
import { Link } from "react-router-dom";


export default function NavBar() {
    const [opacity, setOpacity] = useState(0);


    useEffect(() => {
        const handleScroll = () => {
        const scrollTop = window.scrollY;
        const maxScroll = 300; // distance after which opacity becomes 1
        const newOpacity = Math.min(scrollTop / maxScroll, 1);
        setOpacity(newOpacity);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <div>
        <div className="navbar" style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})`, boxShadow: opacity > 0 ? "0 4px 10px rgba(0, 0, 0, 0.15)" : "none"}}>
            <img src='icon.png' href="#" />
            <div className = "navBarCenter">
                <Link to="/"> Home</Link>
                <Link to="/about"> Product</Link>
                <Link to="contact"> Contact</Link>
            </div>
            <Link className="login" to="/login" > Login</Link>
        </div>
    </div>
  );
}