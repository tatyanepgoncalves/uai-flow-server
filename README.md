# 🔺 UAIFlow Server — Backend Service

> **REST API para Aquisição Inteligente de Idiomas baseada em Neurociência, Chunks Lexicais e Avaliação via IA.**

---

## 📖 Sobre o Projeto

O **UAIFlow Server** é o motor backend da plataforma UAIFlow, desenvolvida para auxiliar estudantes de idiomas com rotinas aceleradas a atingirem fluência real (até o nível B2) através da **prática ativa diária de produção de frases**.

A aplicação combina princípios de neurociência, *comprehensible input* e repetição espaçada adaptativa. O sistema distribui blocos lexicais diários (*chunks*, *collocations*, *phrasal verbs* e expressões idiomáticas) e avalia em tempo real a produção textual do usuário por meio da integração com Modelos de Linguagem (LLM).

---

## Tech Stack

- **Runtime & Linguagem:** Node.js & TypeScript
- **Framework Web:** Fastify (alta performance e baixo overhead)
- **Banco de Dados & ORM:** PostgreSQL & Drizzle ORM
- **Migrações:** Drizzle Kit
- **Validação de Schemas:** Zod
- **Integração com LLM:** OpenAI API / Groq API (avaliação gramatical, semântica e sugestões *native-like*)
- **Armazenamento de Mídia:** Cloudinary SDK (gestão e otimização de avatares)
- **Autenticação:** JWT (JSON Web Tokens) com suporte a cookies HTTP-Only

---

## Estrutura do Projeto

```text
uaiflow-server/
├── docker/            
├── src/
│   ├── @types/          # Definições de tipos globais do TypeScript
│   ├── config/          # Variáveis de ambiente e configs de serviços (Cloudinary, LLM, DB)
│   ├── db/              # Conexão com PostgreSQL, schemas do Drizzle e seeds
│   │   ├── migrations/      # Arquivos SQL gerados pelas migrações
│   │   ├── schema/      # Schemas (users, languages, chunks, sentences, etc.)
│   │   └── index.ts
│   ├── http/            # Rotas, controllers, schemas e middlewares do Fastify
│   │   ├── controllers/ # Lógica das requisições dividida por módulo
│   │   ├── middlewares/ # Middleware de autenticação JWT e tratamento de erros
│   │   ├── schemas/     # Schemas de formatação de resposta e requisição
│   │   └── routes/      # Definição e registro de rotas
│   ├── services/        # Regras de negócio e integrações (LLM Service, Cloudinary)
│   ├── utils/           # Funções utilitárias e helpers
│   ├── app.ts           # Configuração do servidor Fastify
│   └── server.ts        # Ponto de entrada (bootstrap da aplicação)
├── .env.example
├── .biome.jsonc
├── drizzle.config.ts
├── package.json
└── tsconfig.json

```

---

## Como Executar o Projeto Localmente

### Pré-requisitos

* **Node.js** (v18 ou superior)
* **Docker** e **Docker Compose**
* Gerenciador de pacotes (`npm`, `pnpm` ou `bun`)

### 1. Clonar o repositório e instalar dependências

```bash
git clone [https://github.com/tatyanepgoncalves/uai-flow-server.git](https://github.com/tatyanepgoncalves/uai-flow-server.git)
cd uaiflow-server
npm install

```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o arquivo `.env.example` como guia:

```env
NODE_ENV=development
PORT=3333

# Database
DATABASE_URL=postgresql://uaiflow_user:uaiflow_pass@localhost:5432/uaiflow_db

# Auth
JWT_SECRET=sua_chave_secreta_jwt_super_segura

# LLM Integration (OpenAI / Groq)
OPENAI_API_KEY=sua_openai_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

```

### 3. Subir o Banco de Dados via Docker

```bash
docker-compose up -d

```

### 4. Executar as Migrações do Banco de Dados

```bash
npx drizzle-kit push

```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev

```

O servidor estará rodando em: `http://localhost:3333`

---

## Endpoints da API

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| `POST` | `/users` | Cadastro de novo usuário | Pública |
| `POST` | `/sessions` | Autenticação / Login (Retorna JWT) | Pública |
| `GET` | `/me` | Retorna perfil do usuário logado e meta diária | 🔒 Bearer Token |
| `PUT` | `/me/daily-goal` | Atualiza a meta diária de chunks/frases | 🔒 Bearer Token |
| `GET` | `/chunks/daily` | Retorna a nuvem diária de chunks (70% novos + 30% revisão) | 🔒 Bearer Token |
| `POST` | `/sentences` | Submete uma frase para avaliação por IA | 🔒 Bearer Token |
| `GET` | `/sentences` | Lista as frases criadas pelo usuário com filtros | 🔒 Bearer Token |
| `POST` | `/users/avatar` | Upload/Atualização da foto de perfil no Cloudinary | 🔒 Bearer Token |

---

## Fluxo de Avaliação por LLM

Ao enviar uma frase através do endpoint `POST /sentences`, a API invoca o serviço de integração com a LLM passando o *chunk* ativo e o input do usuário. O modelo retorna um JSON estruturado com o seguinte schema:

```json
{
  "score": "correct", // "correct" | "needs_improvement" | "incorrect"
  "feedback": "Sua construção gramatical está correta. O phrasal verb 'look forward to' exige o verbo seguinte no gerúndio (-ing).",
  "native_suggestion": "I am looking forward to meeting you tomorrow."
}

```

---

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

Developed with 🔺 by **Tatyane**
