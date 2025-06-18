// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BRLtoUSD from './pages/BRLtoUSD';
import USDtoBRL from './pages/USDtoBRL';
import Navbar from './components/Navbar'; // Importe o Navbar

function App() {
  return (
    <Router>
      {/* Navbar aparece em todas as páginas e apenas uma vez */}
      <Navbar />
      <div className="App"> {/* Este div é o container principal para o conteúdo das rotas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brl-to-usd" element={<BRLtoUSD />} />
          <Route path="/usd-to-brl" element={<USDtoBRL />} />
          <Route path="*" element={
            <div className="container center-align" style={{marginTop: '100px'}}>
              <div className="card red darken-1 white-text">
                <div className="card-content">
                  <span className="card-title">404: Página Não Encontrada</span>
                  <p>A URL que você tentou acessar não existe.</p>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;