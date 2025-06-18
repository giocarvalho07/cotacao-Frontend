// src/pages/BRLtoUSD.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable'; // IMPORTADO AQUI

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

function BRLtoUSD() {
    const [valorBRL, setValorBRL] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/converter-brl-para-usd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ valor: parseFloat(valorBRL), nomeUsuario }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            {/* CARD DO FORMULÁRIO DE CONVERSÃO */}
            <div className="card">
                <div className="card-content">
                    <span className="card-title black-text">Converter BRL para USD</span> {/* Título preto */}

                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <input
                                id="valorBRL"
                                type="number"
                                value={valorBRL}
                                onChange={(e) => setValorBRL(e.target.value)}
                                step="0.01"
                                required
                            />
                            <label htmlFor="valorBRL">Valor em BRL</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="nomeUsuario"
                                type="text"
                                value={nomeUsuario}
                                onChange={(e) => setNomeUsuario(e.target.value)}
                                required
                            />
                            <label htmlFor="nomeUsuario">Seu Nome</label>
                        </div>
                        <button type="submit" disabled={loading} className="btn waves-effect waves-light green darken-2"> {/* Botão verde */}
                            {loading ? 'Convertendo...' : 'Converter'}
                        </button>
                    </form>

                    {error && (
                        <div className="card red darken-1 white-text mt-3">
                            <div className="card-content">Erro: {error}</div>
                        </div>
                    )}

                    {result && (
                        <div className="card black white-text mt-3"> {/* Resultado preto com texto branco */}
                            <div className="card-content">
                                <span className="card-title">Resultado da Conversão</span>
                                <p>Valor Original (BRL): <span className="fw-bold">R$ {result.valor_original_BRL}</span></p>
                                <p>Valor Convertido (USD): <span className="fw-bold">US$ {result.valor_convertido_USD}</span></p>
                                <p>Usuário: <span className="fw-bold">{result.usuario}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* TABELA DE TRANSAÇÕES */}
            <TransactionTable />
        </div>
    );
}

export default BRLtoUSD;