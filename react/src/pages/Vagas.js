import React, { useEffect, useState } from 'react';

function Vagas() {
  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/vagas')
      .then(response => response.json())
      .then(data => setVagas(data))
      .catch(error => console.error('Erro ao buscar vagas:', error));
  }, []);

  return (
    <div>
      <h1 className="title">Vagas</h1>
      <ul>
        {vagas.map(vaga => (
          <li key={vaga.id}>
            Número: {vaga.numero} - Tipo: {vaga.tipo} - Disponível: {vaga.disponivel ? 'Sim' : 'Não'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Vagas;