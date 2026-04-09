# GEMINI - Safe Finance Dashboard 💎

> **Status**: Sênior Executive Operating System — SSOT (Single Source of Truth)
> **Stack**: Next.js 16 | React 19 | TypeScript | Convex | Shadcn/UI

Este documento serve como a bússola técnica e operacional para o desenvolvimento do **Safe-Finance Dashboard**. Como um sistema operacional executivo, cada linha de código deve ser tratada como um ativo digital, priorizando a escalabilidade, segurança e manutenibilidade.

---

## 🏛️ Arquitetura de Referência (State-of-the-Art)

Adotamos a **Feature Sliced Design (FSD)** como nossa espinha dorsal, separando responsabilidades de forma estrita para evitar o acoplamento cíclico e facilitar a evolução do produto.

### Camadas de Domínio:
- **`app/`**: Configurações globais, providers e roteamento (Next.js App Router).
- **`features/`**: Funcionalidades de negócio independentes que entregam valor (ex: `auth`, `transactions`, `dashboard-metrics`).
- **`entities/`**: Lógicas de negócio centradas em entidades (ex: `User`, `Account`).
- **`shared/`**: Componentes UI reutilizáveis (Shadcn), hooks genéricos, utils e instâncias de lib de infraestrutura.

---

## 📜 Leis Fundamentais de Codificação (Clean Code)

1.  **Fail Fast (Guards Clauses)**: Valide entradas no início da função. Se houver erro, retorne imediatamente.
2.  **Explicit Over Implicit**: Sem "mágica". Tipagem forte (TypeScript) e esquemas de validação (Zod) são obrigatórios para qualquer entrada de dados ou resposta de API.
3.  **Single Responsibility**: Cada componente ou função deve realizar apenas uma ação clara. Se uma função tem mais de 20 linhas, ela provavelmente está fazendo demais.
4.  **Inversão de Dependência**: Use injeção de dependência via argumentos para facilitar testes e desacoplar lógica de infraestrutura.

---

## 🛠️ Stack Tecnológica & Performance

- **Frontend**: Next.js 16 (App Router) + React 19 (Server Components por padrão).
- **Estilização**: Tailwind CSS + Framer Motion para micro-animações premium.
- **Backend / Real-time**: Convex (Database & Functions) para sincronia instantânea de dados.
- **UI System**: Radix UI + Shadcn/UI (Customizado para estética Safe-Finance).
- **Performance**:
    - Zero Cumulative Layout Shift (CLS).
    - Image optimization via `next/image`.
    - Code-splitting agressivo via FSD.

---

## 🛡️ Segurança & Governança (Secure by Design)

- **Hard-code Zero**: Segredos de API e configurações sensíveis devem estar exclusivamente em arquivos `.env` ou cofres de segredos.
- **Sanitização unânime**: Todo input de usuário deve passar por `Zod` antes de tocar a lógica de domínio ou o banco de dados.
- **Git Governance**:
    - Commits seguindo o padrão **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `chore:`).
    - Merge via Pull Request com revisão mandatória de impacto arquitetural.

---

## 🎯 Visão de Produto (CTO Strategy)

O Safe-Finance não é apenas um dashboard; é um **Ativo Digital de Alta Performance**. 
- **Modularidade**: Cada feature deve ser testável isoladamente.
- **User Experience**: Interfaces que "sentem" vivas através de micro-animações e feedback instantâneo (Optimistic Updates).
- **Escalabilidade**: O sistema deve estar preparado para suportar o crescimento da base de dados e de usuários sem degradação de latência.

---

> *"Código é para humanos lerem, e ocasionalmente para máquinas executarem."* — **Agente Sênior Full Stack**
