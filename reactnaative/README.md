# Aplicativo Estacionai - React Native (JavaScript)

Um aplicativo React Native completo para gerenciamento de estacionamento com funcionalidades CRUD para Clientes, Vagas e Veículos.

## 🚀 Funcionalidades

### 📱 Navegação por Abas
- **Clientes**: Gerenciamento de clientes do estacionamento
- **Vagas**: Controle de vagas disponíveis e ocupadas
- **Veículos**: Cadastro de veículos vinculados aos clientes

### 🔧 Operações CRUD Completas
- **Create**: Criar novos registros
- **Read**: Listar e visualizar registros
- **Update**: Editar registros existentes
- **Delete**: Excluir registros com confirmação

### 🎨 Interface Moderna
- Design clean e intuitivo
- Ícones do Ionicons
- Indicadores visuais de status
- Botões de ação flutuantes (FAB)
- Pull-to-refresh nas listagens
- Logs detalhados para debug

## 📁 Estrutura do Projeto

```
EstacionaiApp/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js      # Configuração de navegação
│   ├── screens/
│   │   ├── ClientesScreen.js    # Lista de clientes
│   │   ├── ClienteFormScreen.js # Formulário de cliente
│   │   ├── VagasScreen.js       # Lista de vagas
│   │   ├── VagaFormScreen.js    # Formulário de vaga
│   │   ├── VeiculosScreen.js    # Lista de veículos
│   │   └── VeiculoFormScreen.js # Formulário de veículo
│   └── services/
│       └── api.js               # Configuração da API e serviços
├── App.js                       # Componente principal
└── package.json                 # Dependências do projeto
```

## 🛠️ Tecnologias Utilizadas

- **React Native** com **Expo**
- **JavaScript** (ES6+)
- **React Navigation** para navegação
- **Axios** para requisições HTTP
- **Ionicons** para ícones
- **React Native Picker** para seleções

## ⚙️ Configuração da API

O aplicativo está configurado para consumir a API REST do estacionamento. Para conectar com sua API:

1. Abra o arquivo `src/services/api.js`
2. Altere a constante `API_BASE_URL` para o endereço da sua API:

```javascript
const API_BASE_URL = 'http://SEU_IP:3000'; // Substitua pelo IP da sua API
```

**⚠️ Importante**: Se você estiver testando em um dispositivo físico, use o IP da sua máquina em vez de `localhost`.

## 📱 Instalação e Execução

### Pré-requisitos
- Node.js instalado
- Expo CLI instalado globalmente: `npm install -g @expo/cli`

### Passos para executar:

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

3. **Executar no dispositivo:**
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (apenas no macOS)
   - **Web**: `npm run web`
   - **Expo Go**: Escaneie o QR code com o app Expo Go

## 🔧 Funcionalidades Detalhadas

### 👥 Gestão de Clientes
- Listagem de todos os clientes
- Cadastro de novos clientes (nome, telefone, email)
- Edição de dados dos clientes
- Exclusão de clientes com confirmação
- Validação de email
- Atualização automática da lista após operações

### 🚗 Gestão de Vagas
- Visualização de todas as vagas
- Cadastro de novas vagas (número, tipo, disponibilidade)
- Tipos de vaga: Normal, Preferencial, Idoso, Deficiente, Moto
- Indicador visual de disponibilidade (verde/vermelho)
- Edição e exclusão de vagas

### 🚙 Gestão de Veículos
- Listagem de veículos com informações do proprietário
- Cadastro de veículos (marca, modelo, ano, cor)
- Vinculação automática com clientes
- Validação de ano do veículo
- Edição e exclusão de veículos

## 🌐 API Endpoints Consumidos

### Clientes
- `GET /clientes` - Listar todos os clientes
- `GET /clientes/:id` - Buscar cliente por ID
- `POST /clientes` - Criar novo cliente
- `PUT /clientes/:id` - Atualizar cliente
- `DELETE /clientes/:id` - Excluir cliente

### Vagas
- `GET /vagas` - Listar todas as vagas
- `GET /vagas/:id` - Buscar vaga por ID
- `POST /vagas` - Criar nova vaga
- `PUT /vagas/:id` - Atualizar vaga
- `DELETE /vagas/:id` - Excluir vaga

### Veículos
- `GET /veiculos` - Listar todos os veículos
- `GET /veiculos/:id` - Buscar veículo por ID
- `POST /veiculos` - Criar novo veículo
- `PUT /veiculos/:id` - Atualizar veículo
- `DELETE /veiculos/:id` - Excluir veículo

## 🐛 Tratamento de Erros e Debug

O aplicativo inclui tratamento robusto de erros:
- Alertas informativos para o usuário
- Logs detalhados no console para debug
- Validações de campos obrigatórios
- Verificação de conectividade com a API
- Botão "Tentar novamente" em caso de erro
- Verificação se a resposta da API é um array válido

### Logs de Debug
O aplicativo gera logs detalhados que podem ser visualizados no console:
- Estado dos dados carregados
- Respostas da API
- Erros de conexão
- Operações de CRUD

## 📱 Responsividade

O aplicativo foi desenvolvido seguindo as melhores práticas de React Native:
- Interface adaptável a diferentes tamanhos de tela
- Componentes otimizados para performance
- Navegação intuitiva e acessível
- Suporte a web, Android e iOS

## 🔍 Solução de Problemas

### Problema: "Nenhum cliente encontrado"
1. Verifique se a API está rodando na porta 3000
2. Confirme se o `API_BASE_URL` está correto
3. Verifique os logs no console para erros de conexão
4. Use o botão "Tentar novamente" para recarregar

### Problema: Erro de conexão
1. Certifique-se de que a API está acessível
2. Se estiver testando em dispositivo físico, use o IP da máquina
3. Verifique se não há firewall bloqueando a conexão

## 🚀 Próximos Passos

Possíveis melhorias futuras:
- Implementação de autenticação
- Filtros e busca nas listagens
- Relatórios de ocupação
- Notificações push
- Modo offline com sincronização
- Testes automatizados

## 📝 Notas de Desenvolvimento

- Projeto desenvolvido em **JavaScript puro** (não TypeScript)
- Inclui logs detalhados para facilitar o debug
- Tratamento robusto de erros de API
- Interface responsiva e moderna
- Código bem estruturado e comentado

