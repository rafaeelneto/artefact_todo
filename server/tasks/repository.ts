import { type ListCursor, type Task, type TaskInput } from "@/server/tasks/schema";
import { seedTasks } from "@/server/tasks/seed";

declare global {
  var __tasks: Map<string, Task> | undefined;
}

// Kept on globalThis so the in-memory data survives module re-evaluation during dev hot reload.
const store = (globalThis.__tasks ??= toMap(seedTasks()));

function toMap(tasks: Task[]) {
  return new Map(tasks.map((task) => [task.id, { ...task }]));
}

function compareNewestFirst(a: ListCursor, b: ListCursor) {
  return b.dataCriacao.getTime() - a.dataCriacao.getTime() || b.id.localeCompare(a.id);
}

export function listTasks({ cursor, limit }: { cursor?: ListCursor | null; limit: number }) {
  const sorted = [...store.values()].sort(compareNewestFirst);
  const after = cursor ? sorted.filter((task) => compareNewestFirst(task, cursor) > 0) : sorted;
  const page = after.slice(0, limit + 1);
  const hasMore = page.length > limit;
  const items = page.slice(0, limit).map((task) => ({ ...task }));
  const last = items.at(-1);

  return {
    items,
    nextCursor: hasMore && last ? { dataCriacao: last.dataCriacao, id: last.id } : null,
  };
}

export function getTask(id: string) {
  const task = store.get(id);
  return task && { ...task };
}

export function createTask(input: TaskInput) {
  const task: Task = { id: crypto.randomUUID(), ...input, dataCriacao: new Date() };
  store.set(task.id, task);
  return { ...task };
}

export function updateTask(id: string, input: TaskInput) {
  const current = store.get(id);
  if (!current) return undefined;
  const updated: Task = { ...current, ...input };
  store.set(id, updated);
  return { ...updated };
}

export function deleteTask(id: string) {
  return store.delete(id);
}

export function resetTasks(tasks: Task[] = seedTasks()) {
  store.clear();
  for (const [id, task] of toMap(tasks)) store.set(id, task);
}
