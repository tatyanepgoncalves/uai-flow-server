# Imagem base
FROM node:24-slim

# Instalação do cliente PostgreSQL e OpenSSL
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Diretório de trabalho
WORKDIR /src

# Habilita o pnpm
RUN corepack enable

# Copia os arquivos de dependências
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instala exatamente as versões do lockfile
RUN pnpm install --frozen-lockfile

# Copiar o código do projeto inteiro (incluindo a pasta de migrações)
COPY . .


# O comando definitivo: Aplica as tabelas ao banco e depois inicia a aplicação
CMD ["sh", "-c", "npm run db:push && npm run start"]