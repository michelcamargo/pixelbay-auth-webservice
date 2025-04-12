#!/usr/bin/env bash
set -o errexit

# Cria o .npmrc para acessar o GitHub Packages
echo "//npm.pkg.github.com/:_authToken=${NPM_GITHUB_TOKEN}" > ~/.npmrc

# Instala as dependências do projeto
npm install

# Executa o build do projeto NestJS
npm run build
