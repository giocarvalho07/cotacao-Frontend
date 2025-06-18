// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

function Home() {
    const [cotacao, setCotacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCotacao();
    }, []);

    const fetchCotacao = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/dolar-brl`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCotacao(data.valor_compra);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container center-align" style={{ marginTop: '50px' }}>
            <div className="card-panel white z-depth-1"> {/* Fundo branco para o card */}
                {/* Título do App - texto preto */}
                <h1 className="header black-text">Cotação e Conversão de Moedas</h1>

                {loading && (
                    <div className="center-align my-4">
                        <div className="preloader-wrapper active">
                            <div className="spinner-layer spinner-green-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div><div className="gap-patch">
                                    <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                        <p>Carregando cotação atual...</p>
                    </div>
                )}
                {error && (
                    <div className="card red darken-1 white-text">
                        <div className="card-content">Erro ao carregar cotação: {error}</div>
                    </div>
                )}
                {cotacao && !loading && (
                    // Caixa de cotação: preta com letras brancas
                    <div className="card black white-text">
                        <div className="card-content">
                            <span className="card-title">Cotação Atual USD-BRL (Compra)</span>
                            <p className="flow-text">R$ {parseFloat(cotacao).toFixed(4)}</p>
                        </div>
                    </div>
                )}

                <div className="row mt-5">
                    <div className="col s12 m6">
                        <button
                            onClick={() => navigate('/brl-to-usd')}
                            className="btn-large waves-effect waves-light green darken-2" // Botão verde
                            style={{ width: '100%' }}
                        >
                            
                            <i className="material-icons right">
                                <img width="48" height="48" src="https://img.icons8.com/color/48/brazil-circular.png" alt="brazil-circular"/>
                            </i> {/* Ícone de bandeira, pode ser ajustado com CSS para ser de um país específico */}

                            Converter BRL para USD


                        </button>
                    </div>
                    <div className="col s12 m6">
                        <button
                            onClick={() => navigate('/usd-to-brl')}
                            className="btn-large waves-effect waves-light blue darken-2" // Botão azul
                            style={{ width: '100%' }}
                        >
                            Converter USD para BRL
                            <i className="material-icons right">
                                <img width="48" height="48" src="https://img.icons8.com/fluency/48/usa-circular.png" alt="usa-circular"/>
                            </i> {/* Ícone de bandeira, pode ser ajustado com CSS para ser de um país específico */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;