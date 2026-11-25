import { beforeEach, describe, expect, it } from "vitest";

import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  resetTasks,
  updateTask,
} from "@/server/tasks/repository";
import { type ListCursor, type Task } from "@/server/tasks/schema";

const at = (hour: number) => new Date(Date.UTC(2026, 0, 1, hour));

const fixture: Task[] = [
  { id: "t1", titulo: "Tarefa 1", dataCriacao: at(1) },
  { id: "t2", titulo: "Tarefa 2", dataCriacao: at(2) },
  { id: "tA", titulo: "Tarefa A", dataCriacao: at(3) },
  { id: "tB", titulo: "Tarefa B", dataCriacao: at(3) },
  { id: "t3", titulo: "Tarefa 3", dataCriacao: at(4) },
  { id: "t4", titulo: "Tarefa 4", dataCriacao: at(5) },
  { id: "t5", titulo: "Tarefa 5", descricao: "Mais recente", dataCriacao: at(6) },
];

const collectAllIds = (limit: number) => {
  const ids: string[] = [];
  let cursor: ListCursor | null = null;
  do {
    const page = listTasks({ cursor, limit });
    ids.push(...page.items.map((t) => t.id));
    cursor = page.nextCursor;
  } while (cursor);
  return ids;
};

beforeEach(() => {
  resetTasks(fixture);
});

describe("createTask", () => {
  it("creates a task with a uuid and creation date, listed first", () => {
    const task = createTask({ titulo: "Nova", descricao: undefined });

    expect(task.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(task.dataCriacao).toBeInstanceOf(Date);
    expect(listTasks({ limit: 1 }).items[0]?.id).toBe(task.id);
  });
});

describe("updateTask", () => {
  it("replaces title and description, keeping id and creation date", () => {
    const updated = updateTask("t5", { titulo: "Editada", descricao: undefined });

    expect(updated).toEqual({
      id: "t5",
      titulo: "Editada",
      descricao: undefined,
      dataCriacao: at(6),
    });
    expect(getTask("t5")?.titulo).toBe("Editada");
  });

  it("returns undefined for an unknown id", () => {
    expect(updateTask("nao-existe", { titulo: "x", descricao: undefined })).toBeUndefined();
  });
});

describe("deleteTask", () => {
  it("removes the task once", () => {
    expect(deleteTask("t1")).toBe(true);
    expect(deleteTask("t1")).toBe(false);
    expect(getTask("t1")).toBeUndefined();
  });
});

describe("listTasks", () => {
  it("pages through every task once, newest first, ending with a null cursor", () => {
    expect(collectAllIds(2)).toEqual(["t5", "t4", "t3", "tB", "tA", "t2", "t1"]);
  });

  it("does not skip tasks sharing a timestamp across a page boundary", () => {
    const first = listTasks({ limit: 3 });
    expect(first.items.map((t) => t.id)).toEqual(["t5", "t4", "t3"]);

    const second = listTasks({ cursor: first.nextCursor, limit: 1 });
    const third = listTasks({ cursor: second.nextCursor, limit: 1 });
    expect([...second.items, ...third.items].map((t) => t.id)).toEqual(["tB", "tA"]);
  });

  it("keeps paging after the cursor task is deleted", () => {
    const first = listTasks({ limit: 2 });
    deleteTask(first.items[1]!.id);

    const second = listTasks({ cursor: first.nextCursor, limit: 2 });
    expect(second.items.map((t) => t.id)).toEqual(["t3", "tB"]);
  });

  it("returns a null cursor on the last page", () => {
    expect(listTasks({ limit: 50 }).nextCursor).toBeNull();
  });

  it("returns copies, not the stored objects", () => {
    listTasks({ limit: 1 }).items[0]!.titulo = "mutada";
    expect(getTask("t5")?.titulo).toBe("Tarefa 5");
  });
});
