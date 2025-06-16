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
import { clienteService } from '../services/api';

export default function ClienteFormScreen({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const cliente = route.params?.cliente;
  const isEditing = !!cliente;

  useEffect(() => {
    if (cliente) {
      setNome(cliente._nome || '');
      setTelefone(cliente._telefone || '');
      setEmail(cliente._email || '');
    }
  }, [cliente]);

  const handleSave = async () => {
    if (!nome.trim() || !telefone.trim() || !email.trim()) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    try {
      setLoading(true);
      const clienteData = { 
        nome: nome.trim(), 
        telefone: telefone.trim(), 
        email: email.trim() 
      };

      console.log('Salvando cliente:', clienteData);

      if (isEditing) {
        const response = await clienteService.update(cliente._id, clienteData);
        console.log('Cliente atualizado:', response.data);
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso');
      } else {
        const response = await clienteService.create(clienteData);
        console.log('Cliente criado:', response.data);
        Alert.alert('Sucesso', 'Cliente criado com sucesso');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      Alert.alert('Erro', 'Não foi possível salvar o cliente');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome do cliente"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Digite o telefone"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite o email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
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

