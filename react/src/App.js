import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Clientes from './pages/Clientes';
import Veiculos from './pages/Veiculos';
import Vagas from './pages/Vagas';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar is-primary">
          <div className="navbar-menu">
            <Link className="navbar-item" to="/clientes">Clientes</Link>
            <Link className="navbar-item" to="/veiculos">Veículos</Link>
            <Link className="navbar-item" to="/vagas">Vagas</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/vagas" element={<Vagas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;