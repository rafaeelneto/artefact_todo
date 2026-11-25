import { type Task } from "@/server/tasks/schema";

const samples: Array<Pick<Task, "titulo" | "descricao">> = [
  {
    titulo: "Revisar pull request do módulo de tarefas",
    descricao: "Conferir validações e mensagens de erro.",
  },
  { titulo: "Preparar apresentação da sprint" },
  {
    titulo: "Atualizar dependências do projeto",
    descricao: "Rodar os testes depois de cada atualização.",
  },
  { titulo: "Agendar reunião de planejamento" },
  { titulo: "Escrever testes do repositório", descricao: "Cobrir paginação e exclusão." },
  { titulo: "Responder e-mails pendentes" },
  {
    titulo: "Organizar o quadro de tarefas",
    descricao: "Mover itens concluídos para a coluna certa.",
  },
  { titulo: "Comprar café para o escritório" },
  { titulo: "Documentar a API de tarefas", descricao: "Listar procedimentos e códigos de erro." },
  { titulo: "Revisar layout da página de listagem" },
  { titulo: "Configurar lint e formatação", descricao: "ESLint e Prettier sem conflitos." },
  { titulo: "Planejar estudos da semana" },
  {
    titulo: "Corrigir bug no formulário de edição",
    descricao: "Título vazio não deveria ser enviado.",
  },
  { titulo: "Fazer backup das anotações" },
  { titulo: "Ler artigo sobre renderização no servidor", descricao: "Comparar CSR, SSR e SSG." },
  { titulo: "Limpar a caixa de entrada" },
  { titulo: "Testar o scroll infinito", descricao: "Verificar o carregamento da última página." },
  { titulo: "Revisar textos da interface" },
  { titulo: "Ajustar mensagens de feedback", descricao: "Sucesso e erro devem ser claros." },
  { titulo: "Marcar consulta no dentista" },
  { titulo: "Estudar tRPC com TanStack Query", descricao: "Entender hidratação e invalidação." },
  { titulo: "Pagar conta de internet" },
  { titulo: "Separar livros para doação" },
  { titulo: "Regar as plantas", descricao: "As da varanda precisam de mais água." },
  { titulo: "Montar lista de compras da semana" },
];

const HOUR = 60 * 60 * 1000;

export function seedTasks(): Task[] {
  const now = Date.now();
  return samples.map((sample, index) => ({
    id: crypto.randomUUID(),
    ...sample,
    dataCriacao: new Date(now - (samples.length - index) * HOUR),
  }));
}
