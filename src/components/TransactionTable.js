import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

function TransactionTable() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10); // 10 transações por página
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca que dispara a API
    const [inputSearchTerm, setInputSearchTerm] = useState(''); // Termo digitado no input

    useEffect(() => {
        fetchTransactions(currentPage, pageSize, searchTerm);
    }, [currentPage, pageSize, searchTerm]); // Refetch quando a página, tamanho da página ou termo de busca mudar

    const fetchTransactions = async (page, size, term) => {
        try {
            setLoading(true);
            setError(null);
            const queryParams = new URLSearchParams({
                page: page,
                size: size,
            });
            if (term) {
                queryParams.append('searchTerm', term);
            }
            const response = await fetch(`${API_BASE_URL}/transacoes?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTransactions(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleInputSearchChange = (e) => {
        setInputSearchTerm(e.target.value);
    };

    const handleSearchButtonClick = () => {
        setSearchTerm(inputSearchTerm);
        setCurrentPage(0); // Reset para a primeira página ao pesquisar
    };

    if (loading) return (
        <div className="center-align my-4">
            <div className="preloader-wrapper active">
                <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div>
                    <div className="gap-patch">
                        <div className="circle"></div>
                    </div>
                    <div className="circle-clipper right">
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
                <span className="card-title black-text">Histórico de Transações ({totalElements} total)</span>

                {/* Campo de Busca com Botão */}
                <div className="row valign-wrapper">
                    <div className="col s10">
                        <div className="input-field">
                            <input
                                id="search"
                                type="text"
                                value={inputSearchTerm}
                                onChange={handleInputSearchChange}
                                placeholder="Buscar por usuário ou tipo de transação"
                            />
                            <label htmlFor="search" className="active">Buscar Transações</label>
                        </div>
                    </div>
                    <div className="col s2">
                        <button
                            onClick={handleSearchButtonClick}
                            className="btn waves-effect waves-light green darken-2"
                        >
                            Buscar
                        </button>
                    </div>
                </div>

                {transactions.length === 0 && !loading ? (
                    <p className="flow-text">Nenhuma transação registrada ou encontrada.</p>
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

                {/* Controles de Paginação */}
                {totalPages > 1 && (
                    <ul className="pagination center-align">
                        <li className={currentPage === 0 ? 'disabled' : 'waves-effect'}>
                            <a href="#!" onClick={() => handlePageChange(currentPage - 1)}>
                                &#xAB; {/* Left arrow */}
                            </a>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={currentPage === index ? 'active green darken-2' : 'waves-effect'}>
                                <a href="#!" onClick={() => handlePageChange(index)}>{index + 1}</a>
                            </li>
                        ))}
                        <li className={currentPage === totalPages - 1 ? 'disabled' : 'waves-effect'}>
                            <a href="#!" onClick={() => handlePageChange(currentPage + 1)}>
                                &#xBB; {/* Right arrow */}
                            </a>
                        </li>
                    </ul>
                )}

                {/* Botão de atualização - agora busca a primeira página com o termo de busca atual */}
                <button onClick={() => fetchTransactions(0, pageSize, searchTerm)} className="btn waves-effect waves-light black white-text mt-3">
                    Atualizar Transações
                </button>
            </div>
        </div>
    );
}

export default TransactionTable;