// src/components/TransactionTable.js
import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

function TransactionTable() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/transacoes`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="center-align my-4">
            <div className="preloader-wrapper active">
                <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div><div className="gap-patch">
                        <div className="circle"></div>
                    </div><div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            </div>
            <p>Carregando transações...</p>
        </div>
    );
    if (error) return <div className="card red darken-1 white-text"><div className="card-content">Erro ao carregar transações: {error}</div></div>;

    return (
        <div className="card mt-3">
            <div className="card-content">
                <span className="card-title black-text">Histórico de Transações</span> {/* Título preto */}
                {transactions.length === 0 ? (
                    <p className="flow-text">Nenhuma transação registrada ainda.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="striped highlight">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuário</th>
                                    <th>Tipo</th>
                                    <th>Data/Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td>{tx.id}</td>
                                        <td>{tx.nomeUsuario}</td>
                                        <td>{tx.tipoTransacao}</td>
                                        <td>{new Date(tx.dataTransacao).toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Botão de atualização preto com texto branco */}
                <button onClick={fetchTransactions} className="btn waves-effect waves-light black white-text mt-3">
                    Atualizar Transações
                </button>
            </div>
        </div>
    );
}

export default TransactionTable;