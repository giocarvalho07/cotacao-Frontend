// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Converter from './pages/Converter'; // Importe o novo componente Converter
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/converter" element={<Converter />} /> {/* Nova rota para o conversor genérico */}
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