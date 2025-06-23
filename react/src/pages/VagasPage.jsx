import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, ParkingCircle } from 'lucide-react';
import { vagaService } from '../services/api';

const VagasPage = () => {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVaga, setEditingVaga] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    tipo: 'Normal',
    disponivel: 'Sim'
  });

  const tiposVaga = ['Normal', 'Preferencial', 'Idoso', 'Deficiente', 'Moto'];

  useEffect(() => {
    loadVagas();
  }, []);

  const loadVagas = async () => {
    try {
      setLoading(true);
      const response = await vagaService.getAll();
      
      if (Array.isArray(response.data)) {
        response.data = response.data.map(vaga => {
          const sanitizedVaga = {};
          for (const key in vaga) {
            const sanitizedKey = key.replace(/_/g, '');
            sanitizedVaga[sanitizedKey] = vaga[key];
          }
          return sanitizedVaga;
        });
        setVagas(response.data);
      } else {
        setVagas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      alert('Não foi possível carregar as vagas. Verifique se a API está rodando.');
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.numero.trim()) {
      alert('O número da vaga é obrigatório');
      return;
    }

    const numeroInt = parseInt(formData.numero);
    if (isNaN(numeroInt) || numeroInt <= 0) {
      alert('Por favor, insira um número válido para a vaga');
      return;
    }

    try {
      const vagaData = {
        numero: numeroInt,
        tipo: formData.tipo.trim(),
        disponivel: formData.disponivel
      };

      if (editingVaga) {
        await vagaService.update(editingVaga.id, vagaData);
        alert('Vaga atualizada com sucesso');
      } else {
        await vagaService.create(vagaData);
        alert('Vaga criada com sucesso');
      }

      setShowForm(false);
      setEditingVaga(null);
      setFormData({ numero: '', tipo: 'Normal', disponivel: 'Sim' });
      loadVagas();
    } catch (error) {
      console.error('Erro ao salvar vaga:', error);
      alert('Não foi possível salvar a vaga');
    }
  };

  const handleEdit = (vaga) => {
    setEditingVaga(vaga);
    setFormData({
      numero: vaga.numero ? vaga.numero.toString() : '',
      tipo: vaga.tipo || 'Normal',
      disponivel: vaga.disponivel || 'Sim'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      try {
        await vagaService.delete(id);
        setVagas(vagas.filter(vaga => vaga.id !== id));
        alert('Vaga excluída com sucesso');
      } catch (error) {
        console.error('Erro ao excluir vaga:', error);
        alert('Não foi possível excluir a vaga');
      }
    }
  };

  const getStatusColor = (disponivel) => {
    return disponivel && disponivel.toLowerCase() === 'sim' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBadge = (disponivel) => {
    const isDisponivel = disponivel && disponivel.toLowerCase() === 'sim';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isDisponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isDisponivel ? 'Disponível' : 'Ocupada'}
      </span>
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVaga(null);
    setFormData({ numero: '', tipo: 'Normal', disponivel: 'Sim' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vagas</h1>
          <p className="text-gray-600">Gerencie as vagas do estacionamento</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadVagas}
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
            Nova Vaga
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVaga ? 'Editar Vaga' : 'Nova Vaga'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número da Vaga *</label>
                  <input
                    type="number"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o número da vaga"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo da Vaga *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {tiposVaga.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Disponibilidade *</label>
                  <select
                    value={formData.disponivel}
                    onChange={(e) => setFormData({ ...formData, disponivel: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Sim">Disponível</option>
                    <option value="Não">Ocupada</option>
                  </select>
                </div>
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
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingVaga ? 'Atualizar' : 'Salvar'}
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
              <p className="mt-2 text-gray-500">Carregando vagas...</p>
            </div>
          ) : vagas.length === 0 ? (
            <div className="text-center py-8">
              <ParkingCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma vaga encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando uma nova vaga.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Vaga
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vagas.map((vaga) => (
                    <tr key={vaga.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Vaga #{vaga.numero || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vaga.tipo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getStatusBadge(vaga.disponivel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(vaga)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vaga.id)}
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

export default VagasPage;

