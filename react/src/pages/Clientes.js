import React, { useEffect, useState } from 'react';

function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/clientes')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error('Erro ao buscar clientes:', error));
  }, []);

  return (
    <div>
      <h1 className="title">Clientes</h1>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id}>
            {cliente.nome} - {cliente.telefone} - {cliente.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;