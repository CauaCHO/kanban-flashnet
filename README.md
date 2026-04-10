# 🚀 Kanban Board - Frontend

Sistema de gerenciamento de tarefas estilo **Kanban**, desenvolvido como desafio técnico, consumindo uma API REST com autenticação JWT.

---

## 📌 Sobre o Projeto

Este projeto é um frontend construído com **Next.js + React**, que permite:

* Autenticação de usuários
* Visualização de boards disponíveis
* Gerenciamento de cards em formato Kanban
* Movimentação de cards com drag-and-drop
* Histórico completo de ações
* Feed de atividades em tempo real
* Controle de permissões (admin, editor, viewer)

---

## 🛠️ Tecnologias Utilizadas

* **Next.js (App Router)**
* **React**
* **TypeScript**
* **CSS Modules**
* **@hello-pangea/dnd** (drag-and-drop)
* **JWT (autenticação)**
* **API REST (FastAPI + PostgreSQL)**

---

## 🔐 Autenticação

O sistema utiliza autenticação baseada em **JWT**, com:

* Access Token
* Refresh Token automático
* Armazenamento no `localStorage`

---

## 👥 Usuários de Teste

| Usuário | Senha     | Permissão               |
| ------- | --------- | ----------------------- |
| admin   | Admin@123 | Admin                   |
| alice   | User@123  | Editor                  |
| bob     | User@123  | Editor                  |
| carol   | User@123  | Viewer                  |
| dave    | User@123  | Inativo (erro esperado) |

---

## ⚙️ Funcionalidades

### 🔑 Login

* Login com username e senha
* Tratamento de erro para usuário inativo

### 📋 Boards

* Listagem de boards disponíveis
* Criação de boards (apenas admin)

### 🧩 Kanban

* Colunas com limite WIP
* Cards organizados por coluna
* Drag-and-drop entre colunas

### 🔄 Movimentação

* Modal obrigatório com observação
* Validação de mínimo de caracteres
* Bloqueio por WIP limit

### 📝 Cards

* Criar, editar e excluir
* Definir prioridade
* Adicionar descrição
* Visualizar detalhes completos

### 💬 Comentários

* Adicionar comentários aos cards

### 📜 Histórico

* Histórico completo por card
* Ordenado do mais recente para o mais antigo

### 📡 Feed de Atividade

* Ações registradas em tempo real

### 🔒 Permissões

* Viewer:

  * pode visualizar e comentar
  * não pode mover ou editar
* Admin:

  * controle total
  * criação de boards e colunas

---

## 🎨 Design (Figma)

👉 **Link do Figma:**
*Coloque aqui o link do seu Figma*

---

## ▶️ Como Rodar o Projeto

```bash
# instalar dependências
npm install

# rodar projeto
npm run dev
```

Acesse:

```
http://localhost:3000
```

---

## 🌐 API

Base URL:

```
http://caua.flashnetbrasil.com.br/api/v1
```

---

## 📁 Estrutura do Projeto

```
/app
  /login
  /boards
  /board/[id]
    /components
      /modals
/services
/styles
```

---

## ⚠️ Regras de Negócio Importantes

* Apenas **admin pode criar boards**
* **Observação obrigatória** ao mover card
* **WIP limit** bloqueia novas movimentações
* Viewer não pode editar ou mover
* Histórico é obrigatório e imutável

---

## 🚀 Status do Projeto

✔ Funcionalidades principais implementadas
✔ Integração completa com API
✔ Controle de permissões
✔ Drag-and-drop funcional
✔ Refresh token automático

🔄 Melhorias futuras:

* UI/UX refinada (toasts, animações)
* Responsividade avançada
* Testes automatizados

---

## 👨‍💻 Autor

Desenvolvido por **Cauã Henrique de Oliveira**

---

## 📌 Considerações Finais

Este projeto demonstra:

* Integração com API REST
* Gerenciamento de estado no frontend
* Boas práticas com autenticação JWT
* Organização de código em componentes
* Implementação de regras de negócio no frontend

---

💥 Projeto pronto para avaliação técnica.
