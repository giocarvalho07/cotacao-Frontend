// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

function Navbar() {
    const [cotacao, setCotacao] = useState('...');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCotacao();
    }, []);

    const fetchCotacao = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/dolar-brl`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCotacao(parseFloat(data.valor_compra).toFixed(4));
        } catch (err) {
            setError(err.message);
            setCotacao('Erro');
            console.error("Erro ao buscar cotação na Navbar:", err);
        }
    };

    return (
        // Navbar preta: use 'black' do Materialize
        <nav className="black">
            <div className="nav-wrapper container">
                {/* Logo e links serão brancos por padrão no nav.black */}
                <Link to="/" className="brand-logo left white-text">Conversor de Moedas</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                        <Link to="/" className="white-text"> {/* Adiciona white-text ao Link */}
                            <i className="material-icons left">home</i>
                        </Link>
                    </li>
                    <li>
                        {error ? (
                            <span className="red-text text-lighten-4 tooltipped" data-position="bottom" data-tooltip="Erro ao carregar cotação">
                                Cotação: Erro
                            </span>
                        ) : (
                            <span className="white-text">
                                Cotação USD-BRL: R$ {cotacao}
                            </span>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;