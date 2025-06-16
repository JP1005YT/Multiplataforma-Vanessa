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
import { vagaService } from '../services/api';

export default function VagaFormScreen({ navigation, route }) {
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState('Normal');
  const [disponivel, setDisponivel] = useState('Sim');
  const [loading, setLoading] = useState(false);
  
  const vaga = route.params?.vaga;
  const isEditing = !!vaga;

  useEffect(() => {
    if (vaga) {
      setNumero(vaga._numero ? vaga._numero.toString() : '');
      setTipo(vaga._tipo || 'Normal');
      setDisponivel(vaga._disponivel || 'Sim');
    }
  }, [vaga]);

  const handleSave = async () => {
    if (!numero.trim()) {
      Alert.alert('Erro', 'O número da vaga é obrigatório');
      return;
    }

    const numeroInt = parseInt(numero);
    if (isNaN(numeroInt) || numeroInt <= 0) {
      Alert.alert('Erro', 'Por favor, insira um número válido para a vaga');
      return;
    }

    try {
      setLoading(true);
      const vagaData = { 
        numero: numeroInt, 
        tipo: tipo.trim(), 
        disponivel: disponivel 
      };

      if (isEditing) {
        await vagaService.update(vaga._id, vagaData);
        Alert.alert('Sucesso', 'Vaga atualizada com sucesso');
      } else {
        await vagaService.create(vagaData);
        Alert.alert('Sucesso', 'Vaga criada com sucesso');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a vaga');
      console.error('Erro ao salvar vaga:', error);
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
          <Text style={styles.label}>Número da Vaga *</Text>
          <TextInput
            style={styles.input}
            value={numero}
            onChangeText={setNumero}
            placeholder="Digite o número da vaga"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Tipo da Vaga *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={setTipo}
              style={styles.picker}
            >
              <Picker.Item label="Normal" value="Normal" />
              <Picker.Item label="Preferencial" value="Preferencial" />
              <Picker.Item label="Idoso" value="Idoso" />
              <Picker.Item label="Deficiente" value="Deficiente" />
              <Picker.Item label="Moto" value="Moto" />
            </Picker>
          </View>

          <Text style={styles.label}>Disponibilidade *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={disponivel}
              onValueChange={setDisponivel}
              style={styles.picker}
            >
              <Picker.Item label="Disponível" value="Sim" />
              <Picker.Item label="Ocupada" value="Não" />
            </Picker>
          </View>

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

