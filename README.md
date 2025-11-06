```
casa-da-dinda/
├── frontend/
...
```
```

**Ou melhor ainda:**
````markdown
```
cd backend
npm install
```
```

**Corrija em:**
- Estrutura de pastas (remover `text`)
- Todos os comandos bash (trocar `text` por `bash`)
- Blocos de código JavaScript (trocar `text` por `javascript`)
- Blocos .env (trocar `text` por `env`)

***

### **2. Seção "Suporte" Está Faltando** ⚠️

O README original que gerei tinha uma seção final:

```markdown
## 📞 Suporte

Para dúvidas e suporte, entre em contato através das issues do GitHub.
```

Você tem a seção **Contribuindo** completa, mas falta a de **Suporte** no final.

***

### **3. Pequeno Detalhe na Seção "Contribuindo"** ⚠️

A seção está cortada no final:

**❌ Como está:**
```markdown
## 🤝 Contribuindo
```

**✅ Deveria ter o texto completo:**
```markdown
## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
```

***

### **4. Endpoint DELETE - Explicação Opcional** 💡

Conforme discutimos antes, você poderia adicionar um comentário explicando o DELETE:

**Sugestão de melhoria na seção API Endpoints:**

```markdown
### **Lares (/api/lares)**
POST   /                     # Criar lar (com upload de imagem)
GET    /                     # Listar lares ativos
GET    /:id                  # Buscar lar por ID
GET    /email/:email         # Buscar lar por email
PUT    /:id                  # Atualizar lar (com upload)
PATCH  /:id/toggle-active    # Ativar/desativar lar (usado no frontend)
DELETE /:id                  # Deletar lar permanentemente (administrativo/LGPD)
```

***

### **5. Adicionar Seção de "Tecnologias Utilizadas" (Opcional)** 💡

Poderia adicionar uma seção visual antes de "Arquitetura":

```markdown
## 🛠️ Tecnologias Utilizadas

### Frontend
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Mongoose](https://img.shields.io/badge/Mongoose-8-red)
```

***

## 📋 Checklist de Correções

- [ ] **Corrigir marcação de código** (trocar `text` por linguagem apropriada)
- [ ] **Adicionar seção "Suporte"** no final
- [ ] **Completar texto da seção "Contribuindo"**
- [ ] (Opcional) Adicionar nota sobre DELETE endpoint
- [ ] (Opcional) Adicionar badges de tecnologias

***

## ✅ README Corrigido - Versão Final

Aqui está a versão com as correções:

```markdown
# 🏠 Casa da Dinda - Plataforma de Lares Temporários para Pets

## 📖 Sobre o Projeto

**Casa da Dinda** é uma plataforma web que conecta pessoas que resgatam pets mas não podem ficar com eles permanentemente com anfitriões dispostos a oferecer lares temporários. O projeto visa facilitar o processo de resgate e cuidado de animais em situação de vulnerabilidade.

### 🎯 Objetivo Principal
Conectar pessoas que resgatam pets (tutores) com anfitriões que têm espaço, tempo e recursos para receber esses animais temporariamente, evitando o abandono e garantindo cuidados adequados.

### 🚀 Status do Projeto
**MVP (Minimum Viable Product)** - Protótipo funcional em desenvolvimento

---

## 🏗️ Arquitetura do Sistema

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation

### **Backend** 
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **File Upload**: Multer
- **Validation**: Joi
- **CORS**: Configurado para desenvolvimento

### **Estrutura de Pastas**

```
casa-da-dinda/
├── frontend/
│   ├── src/
│   │   ├── components/ui/     # Componentes shadcn/ui
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── App.tsx            # Roteamento principal
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
└── backend/
    ├── src/
    │   ├── models/            # Modelos Mongoose
    │   ├── controllers/       # Controllers da API
    │   ├── routes/            # Rotas da API
    │   ├── middlewares/       # Middlewares customizados
    │   ├── config/            # Configurações (DB, upload)
    │   └── app.js             # Configuração do Express
    ├── uploads/               # Arquivos enviados
    ├── server.js              # Entry point do servidor
    └── package.json
```

---

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- MongoDB Atlas account (ou MongoDB local)

### **1. Clone o Repositório**
```
git clone <repository-url>
cd casa-da-dinda
```

### **2. Configuração do Backend**
```
cd backend
npm install
```

**Configurar variáveis de ambiente (.env):**
```
PORT=5000
NODE_ENV=development
DB_USER=seu_usuario_mongodb
DB_PASS=sua_senha_mongodb
DB_NAME=casa_da_dinda
DB_CLUSTER1=@cluster0.xxxxx.mongodb.net
DB_CLUSTER2=retryWrites=true&w=majority&appName=Cluster0
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### **3. Configuração do Frontend**
```
cd ../frontend
npm install
```

### **4. Executar o Projeto**

**Backend (Porta 5000):**
```
cd backend
npm run dev  # ou npm start
```

**Frontend (Porta 8080):**
```
cd frontend
npm run dev
```

### **5. Script de Ativação de Lares**
Para ativar lares no banco de dados:
```
cd backend
node ativar-lares.js
```

---

## 📊 Modelos de Dados

### **Lar (Host/Anfitrião)**
```
{
  id: String (UUID único),
  hostName: String (obrigatório),
  email: String (obrigatório, único),
  phone: String (obrigatório),
  city: String (obrigatório),
  state: String (obrigatório, 2 caracteres),
  address: String (obrigatório),
  capacity: Number (obrigatório, mín: 1),
  hasYard: Boolean,
  hasFence: Boolean,
  experience: String,
  availableFor: [String] (Cães, Gatos, Cães de Grande Porte, Filhotes),
  description: String,
  imageUrl: String,
  isActive: Boolean (padrão: true),
  createdAt: Date,
  updatedAt: Date
}
```

### **Solicitação de Estadia**
```
{
  id: String (UUID único),
  homeId: String (referência ao Lar),
  hostEmail: String (email do anfitrião),
  requesterName: String (obrigatório),
  requesterEmail: String (obrigatório),
  requesterPhone: String (obrigatório),
  petName: String (obrigatório),
  petType: String (dog, cat),
  petAge: String,
  petSize: String,
  healthConditions: String,
  behavior: String,
  petImageUrl: String,
  startDate: String,
  duration: String,
  message: String,
  status: String (pending, approved, rejected),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### **Lares (/api/lares)**
```
POST   /                     # Criar lar (com upload de imagem)
GET    /                     # Listar lares ativos
GET    /:id                  # Buscar lar por ID
GET    /email/:email         # Buscar lar por email
PUT    /:id                  # Atualizar lar (com upload)
PATCH  /:id/toggle-active    # Ativar/desativar lar
DELETE /:id                  # Deletar lar permanentemente (administrativo)
```

### **Solicitações (/api/solicitacoes)**
```
POST   /                     # Criar solicitação (com upload de foto do pet)
GET    /                     # Listar todas solicitações
GET    /email/:email         # Buscar solicitações por email
GET    /lar/:homeId          # Buscar solicitações de um lar
GET    /:id                  # Buscar solicitação por ID
PUT    /:id                  # Atualizar solicitação
PATCH  /:id/aceitar          # Aceitar solicitação
PATCH  /:id/negar            # Negar solicitação
DELETE /:id                  # Deletar solicitação
```

---

## 🎨 Páginas e Funcionalidades

### **Páginas Principais**
1. **Index** (`/`) - Página inicial com apresentação
2. **RegisterHome** (`/cadastrar`) - Cadastro de anfitrião
3. **HomesList** (`/lares`) - Lista de lares disponíveis
4. **HomeDetails** (`/lar/:id`) - Detalhes do lar
5. **EditHome** (`/editar/:id`) - Edição de lar
6. **RequestStay** (`/solicitar/:homeId`) - Solicitação de estadia
7. **SolicitacoesLogin** (`/solicitacoes`) - Login para ver solicitações
8. **SolicitacoesList** (`/solicitacoes/:email`) - Lista de solicitações
9. **SolicitacoesDetalhes** (`/solicitacao/:id`) - Detalhes da solicitação
10. **AumigosList** (`/aumigos`) - Lista de pets (futura funcionalidade)

### **Funcionalidades Implementadas**
- ✅ Cadastro de lares temporários com fotos
- ✅ Listagem e busca de lares por localização e tipo de pet
- ✅ Solicitação de estadia com informações do pet
- ✅ Sistema de status para solicitações (pendente/aceita/negada)
- ✅ Upload de imagens (lares e pets)
- ✅ Validação de dados (frontend e backend)
- ✅ Interface responsiva com shadcn/ui
- ✅ Filtros por tipo de pet e localização

---

## 🔧 Middlewares e Validações

### **Multer (Upload de Arquivos)**
- Configuração dinâmica baseada na rota
- Suporte a JPEG, JPG, PNG, WEBP
- Limite de 5MB por arquivo
- Armazenamento em pastas organizadas (`/uploads/lares/`, `/uploads/pets/`)

### **Validação com Joi**
- Validação de dados de entrada para lares e solicitações
- Validação de emails e telefones
- Validação de tipos de pet permitidos

### **Error Handler**
- Middleware centralizado de tratamento de erros
- Logs detalhados para desenvolvimento
- Respostas padronizadas para o frontend

---

## 🚧 Roadmap Futuro

### **Funcionalidades Planejadas**
- [ ] Sistema de autenticação (JWT)
- [ ] Chat em tempo real entre tutor e anfitrião
- [ ] Sistema de avaliações e feedback
- [ ] Notificações por email/SMS
- [ ] Gestão de perfis de usuário
- [ ] Dashboard administrativo
- [ ] API para aplicativo mobile
- [ ] Estadia temporária para viagens do tutor

### **Melhorias Técnicas**
- [ ] Testes automatizados (Jest, Cypress)
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Deploy na nuvem (Vercel + Railway/Heroku)
- [ ] CDN para imagens
- [ ] Cache Redis
- [ ] Monitoramento e logs

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Equipe

**Casa da Dinda Team** - MVP desenvolvido como projeto acadêmico

---

