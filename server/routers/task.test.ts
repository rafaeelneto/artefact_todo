import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "@/server/routers/_app";
import { resetTasks } from "@/server/tasks/repository";
import { createCallerFactory } from "@/server/trpc";

const caller = createCallerFactory(appRouter)({});

const notFound = { code: "NOT_FOUND", message: "Tarefa não encontrada" };

beforeEach(() => {
  resetTasks([]);
});

describe("task router", () => {
  it("rejects creating a task with a whitespace-only title", async () => {
    await expect(caller.task.create({ titulo: "   " })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("creates a task and lists it", async () => {
    await expect(caller.task.create({ titulo: "Estudar tRPC" })).resolves.toMatchObject({
      titulo: "Estudar tRPC",
    });
    expect((await caller.task.list({ limit: 10 })).items).toHaveLength(1);
  });

  it("updates an existing task", async () => {
    const { id } = await caller.task.create({ titulo: "Antes" });

    await expect(caller.task.update({ id, titulo: "Depois" })).resolves.toMatchObject({
      id,
      titulo: "Depois",
    });
  });

  it("returns NOT_FOUND for unknown ids", async () => {
    await expect(caller.task.byId({ id: "nao-existe" })).rejects.toMatchObject(notFound);
    await expect(caller.task.update({ id: "nao-existe", titulo: "x" })).rejects.toMatchObject(
      notFound,
    );
    await expect(caller.task.delete({ id: "nao-existe" })).rejects.toMatchObject(notFound);
  });

  it("deletes a task", async () => {
    const { id } = await caller.task.create({ titulo: "Excluir" });

    await expect(caller.task.delete({ id })).resolves.toEqual({ id });
    await expect(caller.task.byId({ id })).rejects.toMatchObject(notFound);
  });

  it("rejects a page size above 50", async () => {
    await expect(caller.task.list({ limit: 51 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
