Toyo-X — Frontend

Rede social moderna construída com React, Vite e TypeScript.

📌 Sobre o projeto

O Toyo-X é uma rede social com feed de posts, perfis de usuário, sistema de seguidores, curtidas, comentários e notificações em tempo real.

✨ Funcionalidades

🔐 Autenticação com JWT (login, registro, persistência após refresh)

📝 Criação de posts com imagem obrigatória

❤️ Curtidas e 💬 comentários nos posts

👥 Seguir e deixar de seguir usuários

👤 Perfil com avatar, banner e bio editáveis

🔔 Notificações de curtidas, comentários e novos seguidores

🔍 Busca de usuários

🔒 Alteração de senha

🛠️ Tecnologias
Tecnologia Uso
React 18 Interface
TypeScript Tipagem estática
Vite Build e dev server
Tailwind CSS Estilização
Zustand Gerenciamento de estado
Axios Requisições HTTP
React Router Navegação
Lucide React Ícones
🚀 Rodando localmente
Pré-requisitos

Node.js 18+

Backend do Toyo-X rodando (ver README do backend)

Instalação

# Clone o repositório

git clone https://github.com/brenotoyo/Toyo-X.git
cd Toyo-X

# Instale as dependências

npm install

# Configure as variáveis de ambiente

cp .env.example .env

Variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

VITE_API_URL=http://127.0.0.1:8000/api

Inicie o servidor de desenvolvimento
npm run dev

Acesse: http://localhost:5173

📁 Estrutura do projeto
src/
├── components/ # Componentes reutilizáveis
│ ├── feed/ # Feed e cards de posts
│ ├── profile/ # Perfil e modal de edição
│ ├── layout/ # Sidebar, header
│ └── ui/ # Componentes genéricos
├── pages/ # Páginas da aplicação
│ ├── Home.tsx # Feed principal
│ ├── Perfil.tsx # Página de perfil
│ └── ...
├── services/
│ └── api.ts # Instância do Axios configurada
├── store/
│ └── useAuthStore.ts # Estado de autenticação (Zustand)
└── main.tsx

🌐 Deploy

O frontend está deployado na Vercel.

Variável de ambiente no Vercel
Variável Valor
VITE_API_URL https://seu-backend.up.railway.app/api
Arquivo vercel.json (necessário para SPA)
{
"rewrites": [
{ "source": "/(.*)", "destination": "/index.html" }
]
}

🔗 Links

🌐 Site em produção

🔧 Repositório do Backend
