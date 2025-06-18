// src/pages/USDtoBRL.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable';

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

function USDtoBRL() {
    const [valorUSD, setValorUSD] = useState('');
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
            const response = await fetch(`${API_BASE_URL}/converter-usd-para-brl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ valor: parseFloat(valorUSD), nomeUsuario }),
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
                    <span className="card-title black-text">Converter USD para BRL</span> {/* Título preto */}

                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <input
                                id="valorUSD"
                                type="number"
                                value={valorUSD}
                                onChange={(e) => setValorUSD(e.target.value)}
                                step="0.01"
                                required
                            />
                            <label htmlFor="valorUSD">Valor em USD</label>
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
                        <button type="submit" disabled={loading} className="btn waves-effect waves-light blue darken-2"> {/* Botão azul */}
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
                                <p>Valor Original (USD): <span className="fw-bold">US$ {result.valor_original_USD}</span></p>
                                <p>Valor Convertido (BRL): <span className="fw-bold">R$ {result.valor_convertido_BRL}</span></p>
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

export default USDtoBRL;