import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Car } from 'lucide-react';
import { veiculoService, clienteService } from '../services/api';

const VeiculosPage = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    cliente_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [veiculosResponse, clientesResponse] = await Promise.all([
        veiculoService.getAll(),
        clienteService.getAll()
      ]);


      if (Array.isArray(clientesResponse.data)) {
        clientesResponse.data = clientesResponse.data.map(cliente => {
          const sanitizedCliente = {};
          for (const key in cliente) {
            const sanitizedKey = key.replace(/_/g, '');
            sanitizedCliente[sanitizedKey] = cliente[key];
          }
          return sanitizedCliente;
        });
        console.log('Clientes carregados:', clientesResponse.data);
        setClientes(clientesResponse.data);
      } else {
        setClientes([]);
      }
      
      // Adicionar nome do cliente aos veículos
      if (Array.isArray(veiculosResponse.data)) {
        veiculosResponse.data = veiculosResponse.data.map(veiculo => {
          const sanitizedVeiculo = {};
          for (const key in veiculo) {
            const sanitizedKey = key.replace(/_/g, '');
            sanitizedVeiculo[sanitizedKey] = veiculo[key];
          }
          return sanitizedVeiculo;
        });
        const veiculosComCliente = veiculosResponse.data.map(veiculo => {
          const cliente = clientesResponse.data.find(c => c.id === veiculo.clienteid);
          return {
            ...veiculo,
            cliente_nome: cliente?.nome || 'Cliente não encontrado'
          };
        });
        setVeiculos(veiculosComCliente);
      } else {
        setVeiculos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      alert('Não foi possível carregar os veículos. Verifique se a API está rodando.');
      setVeiculos([]);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.marca.trim() || !formData.modelo.trim() || !formData.ano.trim() || 
        !formData.cor.trim() || !formData.cliente_id) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    const anoInt = parseInt(formData.ano);
    if (isNaN(anoInt) || anoInt < 1900 || anoInt > new Date().getFullYear() + 1) {
      alert('Por favor, insira um ano válido');
      return;
    }

    try {
      const veiculoData = {
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        ano: anoInt,
        cor: formData.cor.trim(),
        cliente_id: parseInt(formData.cliente_id)
      };

      if (editingVeiculo) {
        await veiculoService.update(editingVeiculo.id, veiculoData);
        alert('Veículo atualizado com sucesso');
      } else {
        await veiculoService.create(veiculoData);
        alert('Veículo criado com sucesso');
      }

      setShowForm(false);
      setEditingVeiculo(null);
      setFormData({ marca: '', modelo: '', ano: '', cor: '', cliente_id: '' });
      loadData();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      alert('Não foi possível salvar o veículo');
    }
  };

  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setFormData({
      marca: veiculo.marca || '',
      modelo: veiculo.modelo || '',
      ano: veiculo.ano ? veiculo.ano.toString() : '',
      cor: veiculo.cor || '',
      cliente_id: veiculo.cliente_id ? veiculo.cliente_id.toString() : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await veiculoService.delete(id);
        setVeiculos(veiculos.filter(veiculo => veiculo.id !== id));
        alert('Veículo excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        alert('Não foi possível excluir o veículo');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVeiculo(null);
    setFormData({ marca: '', modelo: '', ano: '', cor: '', cliente_id: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
          <p className="text-gray-600">Gerencie os veículos dos clientes</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Veículo
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Marca *</label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite a marca do veículo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Modelo *</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o modelo do veículo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano *</label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o ano do veículo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cor *</label>
                  <input
                    type="text"
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite a cor do veículo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente *</label>
                  <select
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
                </div>
                {clientes.length === 0 && (
                  <p className="text-sm text-red-600">
                    Nenhum cliente encontrado. Cadastre um cliente primeiro.
                  </p>
                )}
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={clientes.length === 0}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {editingVeiculo ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="text-center py-4">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-gray-500">Carregando veículos...</p>
            </div>
          ) : veiculos.length === 0 ? (
            <div className="text-center py-8">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum veículo encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando um novo veículo.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Veículo
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {veiculos.map((veiculo) => (
                    <tr key={veiculo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(veiculo.marca || 'N/A')} {(veiculo.modelo || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {veiculo.ano || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {veiculo.cor || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {veiculo.cliente_nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(veiculo)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(veiculo.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeiculosPage;

