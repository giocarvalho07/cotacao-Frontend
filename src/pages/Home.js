// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css'; // Import Materialize CSS JS

const API_BASE_URL = 'http://localhost:8080/api/v1/cotacao';

// Helper function to get flag or crypto icon URL
const getCurrencyIcon = (code) => {
    const cryptoIcons = {
        'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=026',
        'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026',
        'LTC': 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=026',
        'XRP': 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=026',
        'DOGE': 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=026',
        // Add more crypto icons as needed
    };

    if (cryptoIcons[code]) {
        return cryptoIcons[code];
    } else {
        // Assume it's a national currency and try to get a flag
        const countryCodeMap = {
            'USD': 'us', 'BRL': 'br', 'EUR': 'eu', 'GBP': 'gb', 'ARS': 'ar',
            'CAD': 'ca', 'JPY': 'jp', 'CHF': 'ch', 'AUD': 'au', 'CNY': 'cn',
            'ILS': 'il', 'MXN': 'mx', 'SEK': 'se', 'NZD': 'nz', 'SGD': 'sg',
            'HKD': 'hk', 'NOK': 'no', 'DKK': 'dk', 'PLN': 'pl', 'ZAR': 'za',
            'INR': 'in', 'KRW': 'kr', 'RUB': 'ru', 'TRY': 'tr', 'IDR': 'id',
            'MYR': 'my', 'PHP': 'ph', 'THB': 'th', 'HUF': 'hu', 'CZK': 'cz',
            'ISK': 'is', 'HRK': 'hr', 'RON': 'ro', 'BGN': 'bg', 'UAH': 'ua',
            'CLP': 'cl', 'COP': 'co', 'PEN': 'pe', 'UYU': 'uy', 'PYG': 'py',
            'VEF': 've', 'VND': 'vn', 'PKR': 'pk', 'EGP': 'eg', 'NGN': 'ng',
            'KES': 'ke', 'GHS': 'gh', 'UGX': 'ug', 'TZS': 'tz', 'XOF': 'bj',
            'XAF': 'cm', 'MAD': 'ma', 'DZD': 'dz', 'TND': 'tn', 'LYD': 'ly',
            'SAR': 'sa', 'AED': 'ae', 'QAR': 'qa', 'KWD': 'kw', 'BHD': 'bh',
            'OMR': 'om', 'JOD': 'jo', 'LBP': 'lb', 'SYP': 'sy', 'IQD': 'iq',
            'IRR': 'ir', 'AFN': 'af', 'PKR': 'pk', 'LKR': 'lk', 'BDT': 'bd',
            'NPR': 'np', 'MVR': 'mv', 'BTN': 'bt', 'MMK': 'mm', 'KPW': 'kp',
            'KZT': 'kz', 'UZS': 'uz', 'TJS': 'tj', 'KGS': 'kg', 'GEL': 'ge',
            'AMD': 'am', 'AZN': 'az', 'BYN': 'by', 'MDL': 'md', 'ALL': 'al',
            'BAM': 'ba', 'MKD': 'mk', 'RSD': 'rs', 'BAM': 'ba', 'XCD': 'ag',
            'BBD': 'bb', 'BMD': 'bm', 'BSD': 'bs', 'BZD': 'bz', 'CRC': 'cr',
            'CUP': 'cu', 'DOP': 'do', 'GTQ': 'gt', 'HNL': 'hn', 'JMD': 'jm',
            'NIO': 'ni', 'PAB': 'pa', 'SVC': 'sv', 'TTD': 'tt', 'XCD': 'ag',
            'ANG': 'cw', 'AWG': 'aw', 'BIF': 'bi', 'CDF': 'cd', 'DJF': 'dj',
            'ERN': 'er', 'ETB': 'et', 'KMF': 'km', 'LSL': 'ls', 'MGA': 'mg',
            'MRO': 'mr', 'MUR': 'mu', 'MWK': 'mw', 'MZN': 'mz', 'NAD': 'na',
            'RWF': 'rw', 'SCR': 'sc', 'SDG': 'sd', 'SOS': 'so', 'SSP': 'ss',
            'SZL': 'sz', 'TWD': 'tw', 'TZS': 'tz', 'UGX': 'ug', 'XAF': 'cm',
            'XOF': 'bj', 'ZMW': 'zm', 'ZWL': 'zw',
            // Add more currency to country code mappings as needed
        };
        const countryCode = countryCodeMap[code.toUpperCase()];
        if (countryCode) {
            return `https://flagcdn.com/w40/${countryCode}.png`;
        }
    }
    // Fallback to a generic money icon if no specific icon is found
    return 'https://cdn-icons-png.flaticon.com/512/253/253671.png'; // Generic money icon
};

function Home() {
    const navigate = useNavigate();
    const [uniqueCurrencyData, setUniqueCurrencyData] = useState([]);
    const [loadingQuotes, setLoadingQuotes] = useState(true);
    const [errorQuotes, setErrorQuotes] = useState(null);

    useEffect(() => {
        const fetchAndProcessCurrencyQuotes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/moedas-disponiveis`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.erro || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // data is Map<String, CotacaoMoeda>

                const processedCurrencies = {};
                Object.values(data).forEach(quote => {
                    // Prioritize BRL pairs for quotes if available
                    if (quote.codein === 'BRL') {
                        processedCurrencies[quote.code] = {
                            code: quote.code,
                            name: quote.name.split('/')[0].trim(),
                            bid: parseFloat(quote.bid).toFixed(4),
                            timestamp: quote.timestamp
                        };
                    } else if (!processedCurrencies[quote.code]) {
                        // If no BRL pair, just add the currency code and name
                        processedCurrencies[quote.code] = {
                            code: quote.code,
                            name: quote.name.split('/')[0].trim(),
                            bid: 'N/A',
                            timestamp: quote.timestamp
                        };
                    }

                    if (!processedCurrencies[quote.codein]) {
                         // Try to find a more appropriate name for the 'codein' currency
                        const codeinName = Object.values(data).find(q => q.code === quote.codein)?.name.split('/')[0].trim();
                        processedCurrencies[quote.codein] = {
                            code: quote.codein,
                            name: codeinName || quote.codein,
                            bid: 'N/A',
                            timestamp: quote.timestamp
                        };
                    }
                });
                setUniqueCurrencyData(Object.values(processedCurrencies));
            } catch (err) {
                console.error("Erro ao buscar e processar cotações de moedas:", err);
                setErrorQuotes("Não foi possível carregar as cotações de moedas.");
            }
            finally {
                setLoadingQuotes(false);
            }
        };
        fetchAndProcessCurrencyQuotes();
    }, []);

    useEffect(() => {
        // Initialize Materialize carousel after data is loaded
        if (!loadingQuotes && !errorQuotes && uniqueCurrencyData.length > 0) {
            const elems = document.querySelectorAll('.carousel');
            M.Carousel.init(elems, {
                numVisible: 5,
                padding: 10,
                dist: -80,
                shift: 0,
                fullWidth: false,
                indicators: true,
            });
        }
    }, [loadingQuotes, errorQuotes, uniqueCurrencyData]);

    return (
        <div className="container center-align" style={{ marginTop: '100px' }}>
            <div className="card-panel white z-depth-1">
                <h1 className="header black-text">Bem-vindo ao Conversor de Moedas</h1>
                <p className="flow-text grey-text text-darken-1">
                    Converta valores entre diversas moedas de forma rápida e fácil.
                    Obtenha cotações em tempo real e registre suas transações.
                </p>
                <div style={{ marginTop: '50px' }}>
                    <button
                        onClick={() => navigate('/converter')}
                        className="btn-large waves-effect waves-light green darken-2"
                    >
                        Iniciar Conversão
                    </button>
                </div>
            </div>

            <div className="card-panel white z-depth-1" style={{ marginTop: '30px' }}>
                <h4 className="header black-text">Cotações Atuais</h4>
                {loadingQuotes && (
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                )}
                {errorQuotes && (
                    <div className="card red darken-1 white-text">
                        <div className="card-content">Erro: {errorQuotes}</div>
                    </div>
                )}
                {!loadingQuotes && !errorQuotes && uniqueCurrencyData.length > 0 && (
                    <div className="carousel">
                        {uniqueCurrencyData.map((currency) => (
                            <div className="carousel-item" key={currency.code}>
                                <div className="card black white-text" style={{ width: '250px', margin: '0 10px' }}>
                                    <div className="card-content">
                                        <div className="currency-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                            <img src={getCurrencyIcon(currency.code)} alt={`${currency.code} icon`} style={{ width: '40px', height: 'auto', marginRight: '10px' }} />
                                            <span className="card-title" style={{ margin: 0 }}>{currency.code} - {currency.name}</span>
                                        </div>
                                        <p>Preço do Ativo: R$ {currency.bid}</p>
                                        <p className="right-align"><small>Atualizado em: {currency.timestamp !== 'N/A' ? new Date(parseInt(currency.timestamp) * 1000).toLocaleString() : 'N/A'}</small></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!loadingQuotes && !errorQuotes && uniqueCurrencyData.length === 0 && (
                    <p>Nenhuma cotação disponível no momento.</p>
                )}
            </div>
        </div>
    );
}

export default Home;