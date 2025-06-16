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
import { clienteService } from '../services/api';

export default function ClientesScreen({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  // Adicionar listener para quando a tela receber foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadClientes();
    });

    return unsubscribe;
  }, [navigation]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      console.log('Carregando clientes...');
      const response = await clienteService.getAll();
      console.log('Resposta da API:', response.data);
      
      // Verificar se response.data é um array
      if (Array.isArray(response.data)) {
        setClientes(response.data);
        console.log('Clientes carregados:', response.data.length);
      } else {
        console.error('Resposta da API não é um array:', response.data);
        setClientes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os clientes. Verifique se a API está rodando.');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClientes();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteCliente(id) },
      ]
    );
  };

  const deleteCliente = async (id) => {
    try {
      await clienteService.delete(id);
      setClientes(clientes.filter(cliente => cliente.id !== id));
      Alert.alert('Sucesso', 'Cliente excluído com sucesso');
      loadClientes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o cliente');
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const renderCliente = ({ item }) => {
    console.log('Renderizando cliente:', item);
    return (
      <View style={styles.clienteItem}>
        <View style={styles.clienteInfo}>
          <Text style={styles.clienteNome}>{item._nome || 'Nome não informado'}</Text>
          <Text style={styles.clienteDetalhes}>{item._telefone || 'Telefone não informado'}</Text>
          <Text style={styles.clienteDetalhes}>{item._email || 'Email não informado'}</Text>
        </View>
        <View style={styles.clienteActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('ClienteForm', { cliente: item })}
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
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? 'Carregando...' : 'Nenhum cliente encontrado'}
      </Text>
      {!loading && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadClientes}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  console.log('Estado atual - clientes:', clientes.length, 'loading:', loading);

  return (
    <View style={styles.container}>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
        renderItem={renderCliente}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={clientes.length === 0 ? styles.emptyListContainer : null}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ClienteForm')}
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
  clienteItem: {
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
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clienteDetalhes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  clienteActions: {
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

