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
import { vagaService } from '../services/api';

export default function VagasScreen({ navigation }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVagas();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadVagas();
    });

    return unsubscribe;
  }, [navigation]);

  const loadVagas = async () => {
    try {
      setLoading(true);
      const response = await vagaService.getAll();
      if (Array.isArray(response.data)) {
        setVagas(response.data);
      } else {
        setVagas([]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as vagas');
      console.error('Erro ao carregar vagas:', error);
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVagas();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta vaga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteVaga(id) },
      ]
    );
  };

  const deleteVaga = async (id) => {
    try {
      await vagaService.delete(id);
      setVagas(vagas.filter(vaga => vaga._id !== id));
      Alert.alert('Sucesso', 'Vaga excluída com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a vaga');
      console.error('Erro ao excluir vaga:', error);
    }
  };

  const getStatusColor = (disponivel) => {
    return disponivel && disponivel.toLowerCase() === 'sim' ? '#4CAF50' : '#f44336';
  };

  const getStatusText = (disponivel) => {
    return disponivel && disponivel.toLowerCase() === 'sim' ? 'Disponível' : 'Ocupada';
  };

  const renderVaga = ({ item }) => (
    <View style={styles.vagaItem}>
      <View style={styles.vagaInfo}>
        <Text style={styles.vagaNumero}>Vaga #{item._numero || 'N/A'}</Text>
        <Text style={styles.vagaTipo}>Tipo: {item._tipo || 'N/A'}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item._disponivel) }
            ]}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item._disponivel) }]}>
            {getStatusText(item._disponivel)}
          </Text>
        </View>
      </View>
      <View style={styles.vagaActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('VagaForm', { vaga: item })}
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
        data={vagas}
        keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
        renderItem={renderVaga}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Carregando...' : 'Nenhuma vaga encontrada'}
            </Text>
          </View>
        }
        contentContainerStyle={vagas.length === 0 ? styles.emptyListContainer : null}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('VagaForm')}
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
  vagaItem: {
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
  vagaInfo: {
    flex: 1,
  },
  vagaNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vagaTipo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  vagaActions: {
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

