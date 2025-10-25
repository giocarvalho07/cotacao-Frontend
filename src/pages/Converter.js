import React, { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

function Converter() {
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uniqueCurrencies, setUniqueCurrencies] = useState({}); // Stores unique currencies (e.g., USD -> Dólar Americano)

    useEffect(() => {
        const fetchAndProcessCurrencies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/moedas-disponiveis`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.erro || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // data is Map<String, CotacaoMoeda>

                const processedCurrencies = {};
                Object.values(data).forEach(quote => {
                    // Add 'from' currency
                    if (!processedCurrencies[quote.code]) {
                        processedCurrencies[quote.code] = quote.name.split('/')[0].trim(); // Take first part of name
                    }
                    // Add 'to' currency (if different from 'from')
                    if (!processedCurrencies[quote.codein]) {
                        // Try to find a more appropriate name for the 'codein' currency
                        // This is a heuristic, might need refinement for edge cases
                        const codeinName = Object.values(data).find(q => q.code === quote.codein)?.name.split('/')[0].trim();
                        processedCurrencies[quote.codein] = codeinName || quote.codein; // Fallback to codein if name not found
                    }
                });
                setUniqueCurrencies(processedCurrencies);
            } catch (err) {
                console.error("Erro ao buscar e processar moedas disponíveis:", err);
                setError("Não foi possível carregar as moedas disponíveis.");
            }
        };
        fetchAndProcessCurrencies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/converter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ from: fromCurrency, to: toCurrency, amount: parseFloat(amount), nomeUsuario }),
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
            <div className="card">
                <div className="card-content">
                    <span className="card-title black-text">Conversor de Moedas</span>

                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="browser-default"
                                required
                            >
                                <option value="" disabled>De</option>
                                {Object.entries(uniqueCurrencies).map(([code, name]) => (
                                    <option key={code} value={code}>{name} ({code})</option>
                                ))}
                            </select>
                            <label className="active">Converter De</label>
                        </div>

                        <div className="input-field">
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="browser-default"
                                required
                            >
                                <option value="" disabled>Para</option>
                                {Object.entries(uniqueCurrencies).map(([code, name]) => (
                                    <option key={code} value={code}>{name} ({code})</option>
                                ))}
                            </select>
                            <label className="active">Converter Para</label>
                        </div>

                        <div className="input-field">
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                step="0.01"
                                required
                            />
                            <label htmlFor="amount">Valor</label>
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
                        <button type="submit" disabled={loading} className="btn waves-effect waves-light green darken-2">
                            {loading ? 'Convertendo...' : 'Converter'}
                        </button>
                    </form>

                    {error && (
                        <div className="card red darken-1 white-text mt-3">
                            <div className="card-content">Erro: {error}</div>
                        </div>
                    )}

                    {result && (
                        <div className="card black white-text mt-3">
                            <div className="card-content">
                                <span className="card-title">Resultado da Conversão</span>
                                <p>De ({result.from}): <span className="fw-bold">{result.amount}</span></p>
                                <p>Para ({result.to}): <span className="fw-bold">{result.convertedAmount}</span></p>
                                <p>Usuário: <span className="fw-bold">{result.usuario}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <TransactionTable />
        </div>
    );
}

export default Converter;
