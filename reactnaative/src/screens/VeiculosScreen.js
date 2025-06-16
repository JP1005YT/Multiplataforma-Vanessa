import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { veiculoService, clienteService } from '../services/api';

export default function VeiculosScreen({ navigation }) {
  const [veiculos, setVeiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [veiculosResponse, clientesResponse] = await Promise.all([
        veiculoService.getAll(),
        clienteService.getAll()
      ]);
      
      if (Array.isArray(clientesResponse.data)) {
        setClientes(clientesResponse.data);
      } else {
        setClientes([]);
      }
      
      // Adicionar nome do cliente aos veículos
      if (Array.isArray(veiculosResponse.data)) {
        const veiculosComCliente = veiculosResponse.data.map(veiculo => {
          const cliente = clientesResponse.data.find(c => c.id === veiculo._cliente_id);
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
      Alert.alert('Erro', 'Não foi possível carregar os veículos');
      console.error('Erro ao carregar veículos:', error);
      setVeiculos([]);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este veículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteVeiculo(id) },
      ]
    );
  };

  const deleteVeiculo = async (id) => {
    try {
      await veiculoService.delete(id);
      setVeiculos(veiculos.filter(veiculo => veiculo._id !== id));
      Alert.alert('Sucesso', 'Veículo excluído com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o veículo');
      console.error('Erro ao excluir veículo:', error);
    }
  };

  const renderVeiculo = ({ item }) => (
    <View style={styles.veiculoItem}>
      <View style={styles.veiculoInfo}>
        <Text style={styles.veiculoMarca}>
          {(item._marca || 'N/A')} {(item._modelo || '')}
        </Text>
        <Text style={styles.veiculoDetalhes}>Ano: {item._ano || 'N/A'}</Text>
        <Text style={styles.veiculoDetalhes}>Cor: {item._cor || 'N/A'}</Text>
        <Text style={styles.veiculoCliente}>Cliente: {item._cliente}</Text>
      </View>
      <View style={styles.veiculoActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('VeiculoForm', { veiculo: item, clientes })}
        >
          <Ionicons name="pencil" size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={veiculos}
        keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
        renderItem={renderVeiculo}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Carregando...' : 'Nenhum veículo encontrado'}
            </Text>
          </View>
        }
        contentContainerStyle={veiculos.length === 0 ? styles.emptyListContainer : null}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('VeiculoForm', { clientes })}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyListContainer: {
    flex: 1,
  },
  veiculoItem: {
    backgroundColor: 'white',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  veiculoInfo: {
    flex: 1,
  },
  veiculoMarca: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  veiculoDetalhes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  veiculoCliente: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
    marginTop: 4,
  },
  veiculoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

