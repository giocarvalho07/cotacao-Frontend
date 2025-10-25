// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="black">
            <div className="nav-wrapper container">
                <Link to="/" className="brand-logo left white-text">Conversor de Moedas</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                        <Link to="/converter" className="white-text">
                            Converter de Moedas
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;