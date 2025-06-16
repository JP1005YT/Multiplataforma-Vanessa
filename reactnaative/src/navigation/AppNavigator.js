import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importar as telas
import ClientesScreen from '../screens/ClientesScreen';
import VagasScreen from '../screens/VagasScreen';
import VeiculosScreen from '../screens/VeiculosScreen';
import ClienteFormScreen from '../screens/ClienteFormScreen';
import VagaFormScreen from '../screens/VagaFormScreen';
import VeiculoFormScreen from '../screens/VeiculoFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para Clientes
function ClientesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ClientesList" 
        component={ClientesScreen} 
        options={{ title: 'Clientes' }}
      />
      <Stack.Screen 
        name="ClienteForm" 
        component={ClienteFormScreen} 
        options={{ title: 'Cliente' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Vagas
function VagasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="VagasList" 
        component={VagasScreen} 
        options={{ title: 'Vagas' }}
      />
      <Stack.Screen 
        name="VagaForm" 
        component={VagaFormScreen} 
        options={{ title: 'Vaga' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Veículos
function VeiculosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="VeiculosList" 
        component={VeiculosScreen} 
        options={{ title: 'Veículos' }}
      />
      <Stack.Screen 
        name="VeiculoForm" 
        component={VeiculoFormScreen} 
        options={{ title: 'Veículo' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Clientes') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Vagas') {
              iconName = focused ? 'car' : 'car-outline';
            } else if (route.name === 'Veículos') {
              iconName = focused ? 'car-sport' : 'car-sport-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Clientes" component={ClientesStack} />
        <Tab.Screen name="Vagas" component={VagasStack} />
        <Tab.Screen name="Veículos" component={VeiculosStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

