import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';

function Veiculos() {
    const [veiculos, setVeiculos] = useState([]);
    const [formMode, setFormMode] = useState('list'); // 'list', 'create', 'edit'
    const [veiculoAtual, setVeiculoAtual] = useState({ id: null, marca: '', modelo: '', ano: '', cor: '' });

    useEffect(() => {
        fetchVeiculos();
    }, []);

    const fetchVeiculos = () => {
        fetch('http://localhost:3001/veiculos')
            .then(response => response.json())
            .then(data => setVeiculos(data))
            .catch(error => console.error('Erro ao buscar veículos:', error));
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
            fetch(`http://localhost:3001/veiculos/${id}`, { method: 'DELETE' })
                .then(() => fetchVeiculos())
                .catch(error => console.error('Erro ao deletar veículo:', error));
        }
    };

    const handleSave = () => {
        const method = veiculoAtual.id ? 'PUT' : 'POST';
        const url = veiculoAtual.id 
            ? `http://localhost:3001/veiculos/${veiculoAtual.id}` 
            : 'http://localhost:3001/veiculos';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veiculoAtual),
        })
            .then(() => {
                fetchVeiculos();
                setFormMode('list');
                setVeiculoAtual({ id: null, marca: '', modelo: '', ano: '', cor: '' });
            })
            .catch(error => console.error('Erro ao salvar veículo:', error));
    };

    return (
        <div className="container">
            <h1 className="title has-text-centered">Veículos</h1>
            {formMode === 'list' && (
                <>
                    <button className="button is-primary mb-4" onClick={() => setFormMode('create')}>
                        Adicionar Novo Veículo
                    </button>
                    <table className="table is-bordered is-striped is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Ano</th>
                                <th>Cor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {veiculos.map(veiculo => (
                                <tr key={veiculo.id}>
                                    <td>{veiculo.marca}</td>
                                    <td>{veiculo.modelo}</td>
                                    <td>{veiculo.ano}</td>
                                    <td>{veiculo.cor}</td>
                                    <td>
                                        <button
                                            className="button is-small is-info mr-2"
                                            onClick={() => {
                                                setVeiculoAtual(veiculo);
                                                setFormMode('edit');
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="button is-small is-danger"
                                            onClick={() => handleDelete(veiculo.id)}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {(formMode === 'create' || formMode === 'edit') && (
                <>
                    <h2 className="subtitle">
                        {formMode === 'create' ? 'Adicionar Novo Veículo' : 'Editar Veículo'}
                    </h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        <div className="field">
                            <label className="label">Marca</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={veiculoAtual.marca}
                                    onChange={(e) => setVeiculoAtual({ ...veiculoAtual, marca: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Modelo</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={veiculoAtual.modelo}
                                    onChange={(e) => setVeiculoAtual({ ...veiculoAtual, modelo: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Ano</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    value={veiculoAtual.ano}
                                    onChange={(e) => setVeiculoAtual({ ...veiculoAtual, ano: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Cor</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={veiculoAtual.cor}
                                    onChange={(e) => setVeiculoAtual({ ...veiculoAtual, cor: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-primary" type="submit">
                                    {formMode === 'create' ? 'Adicionar' : 'Salvar'}
                                </button>
                            </div>
                            <div className="control">
                                <button className="button is-light" onClick={() => setFormMode('list')}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default Veiculos;
