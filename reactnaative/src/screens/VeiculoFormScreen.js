import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { veiculoService, clienteService } from '../services/api';

export default function VeiculoFormScreen({ navigation, route }) {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [clienteId, setClienteId] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const veiculo = route.params?.veiculo;
  const clientesParam = route.params?.clientes;
  const isEditing = !!veiculo;

  useEffect(() => {
    if (clientesParam && Array.isArray(clientesParam)) {
      setClientes(clientesParam);
    } else {
      loadClientes();
    }

    if (veiculo) {
      setMarca(veiculo._marca || '');
      setModelo(veiculo._modelo || '');
      setAno(veiculo._ano ? veiculo._ano.toString() : '');
      setCor(veiculo._cor || '');
      setClienteId(veiculo._cliente_id || null);
    }
  }, [veiculo, clientesParam]);

  const loadClientes = async () => {
    try {
      const response = await clienteService.getAll();
      if (Array.isArray(response.data)) {
        setClientes(response.data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os clientes');
      console.error('Erro ao carregar clientes:', error);
      setClientes([]);
    }
  };

  const handleSave = async () => {
    if (!marca.trim() || !modelo.trim() || !ano.trim() || !cor.trim() || !clienteId) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    const anoInt = parseInt(ano);
    if (isNaN(anoInt) || anoInt < 1900 || anoInt > new Date().getFullYear() + 1) {
      Alert.alert('Erro', 'Por favor, insira um ano válido');
      return;
    }

    try {
      setLoading(true);
      const veiculoData = { 
        marca: marca.trim(), 
        modelo: modelo.trim(), 
        ano: anoInt, 
        cor: cor.trim(),
        cliente_id: clienteId
      };

      if (isEditing) {
        await veiculoService.update(veiculo._id, veiculoData);
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso');
      } else {
        await veiculoService.create(veiculoData);
        Alert.alert('Sucesso', 'Veículo criado com sucesso');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o veículo');
      console.error('Erro ao salvar veículo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Marca *</Text>
          <TextInput
            style={styles.input}
            value={marca}
            onChangeText={setMarca}
            placeholder="Digite a marca do veículo"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Modelo *</Text>
          <TextInput
            style={styles.input}
            value={modelo}
            onChangeText={setModelo}
            placeholder="Digite o modelo do veículo"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Ano *</Text>
          <TextInput
            style={styles.input}
            value={ano}
            onChangeText={setAno}
            placeholder="Digite o ano do veículo"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Cor *</Text>
          <TextInput
            style={styles.input}
            value={cor}
            onChangeText={setCor}
            placeholder="Digite a cor do veículo"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Cliente *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={clienteId}
              onValueChange={setClienteId}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um cliente" value={null} />
              {clientes.map(cliente => (
                <Picker.Item 
                  key={cliente._id} 
                  label={cliente._nome} 
                  value={cliente._id} 
                />
              ))}
            </Picker>
          </View>

          {clientes.length === 0 && (
            <Text style={styles.warningText}>
              Nenhum cliente encontrado. Cadastre um cliente primeiro.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton, 
              (loading || clientes.length === 0) && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={loading || clientes.length === 0}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  warningText: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

