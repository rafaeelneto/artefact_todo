# Tarefas

Gerenciador de tarefas simples feito com Next.js 15 e tRPC. As tarefas ficam em memória no servidor: não há banco de dados, então os dados voltam ao estado inicial sempre que o servidor reinicia.

**Demo:** [artefact-todo.onrender.com](https://artefact-todo.onrender.com/)

> Hospedado no plano gratuito do Render: depois de 15 minutos sem acesso o servidor hiberna, então o primeiro carregamento pode levar cerca de um minuto e as tarefas voltam ao estado inicial.

## Funcionalidades

- Listagem renderizada no servidor (SSR), com scroll infinito
- Criação e edição de tarefas com validação no formulário e no servidor
- Exclusão direto da listagem, com confirmação e mensagem de sucesso ou erro
- Estados de carregamento, lista vazia e erro com opção de tentar novamente

## Stack

- [Next.js 15](https://nextjs.org) (App Router) e React 19
- [tRPC 11](https://trpc.io) com [TanStack Query 5](https://tanstack.com/query)
- [zod](https://zod.dev) para validação e [react-hook-form](https://react-hook-form.com) no formulário
- [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) e [sonner](https://sonner.emilkowal.ski)
- [Vitest](https://vitest.dev) para os testes

## Como rodar

Requer Node.js 22.12 ou superior.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
npm test          # testes do repositório e do router tRPC
npm run check     # typecheck, lint e formatação
npm run build     # build de produção
npm start         # servidor de produção (após o build)
```

## Como funciona

```
server/tasks/        schema zod, repositório em memória e dados iniciais
server/routers/      procedures tRPC (list, byId, create, update, delete)
app/api/trpc/        rota que expõe o router via HTTP
trpc/                integração do tRPC com o TanStack Query (servidor e cliente)
app/                 páginas: listagem, nova tarefa e edição
components/tasks/    componentes da listagem e do formulário
```

Fluxo de dados da listagem:

```
servidor                                       navegador
page.tsx ─ busca a 1ª página chamando o
           router direto (sem HTTP)
         └ envia o cache junto com o HTML ───► TanStack Query recebe o cache (hydrate)
                                               a lista aparece sem nova requisição
                                               scroll   → próximas páginas via /api/trpc
                                               excluir  → invalida a lista e busca de novo
```

## Decisões

- **tRPC + TanStack Query:** o tRPC garante a tipagem entre client e server e o TanStack Query lida com o cache, estados de carregamento e atualização da lista depois de criar, editar ou excluir.
- **Paginação por cursor (`dataCriacao` + `id`):** cada página começa depois da posição da última tarefa carregada, então excluir uma tarefa durante o scroll não pula nem repete itens.
- **Um único schema zod:** as mesmas regras validam o formulário e as procedures do servidor; erros de campo vindos do servidor aparecem embaixo do campo correspondente.
- **Armazenamento em um `Map` no `globalThis`:** acesso por id simples e rápido, e os dados sobrevivem ao hot reload em desenvolvimento.
- **Next.js fixado na versão 15:** atende ao requisito do desafio, mesmo havendo versões mais novas.
