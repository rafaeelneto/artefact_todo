import { TRPCError } from "@trpc/server";

import { createTask, deleteTask, getTask, listTasks, updateTask } from "@/server/tasks/repository";
import { listInput, taskId, taskInput } from "@/server/tasks/schema";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

function orNotFound<T>(value: T | undefined | false): T {
  if (!value) throw new TRPCError({ code: "NOT_FOUND", message: "Tarefa não encontrada" });
  return value;
}

export const taskRouter = createTRPCRouter({
  list: publicProcedure.input(listInput).query(({ input }) => listTasks(input)),

  byId: publicProcedure.input(taskId).query(({ input }) => orNotFound(getTask(input.id))),

  create: publicProcedure.input(taskInput).mutation(({ input }) => createTask(input)),

  update: publicProcedure
    .input(taskId.extend(taskInput.shape))
    .mutation(({ input: { id, ...data } }) => orNotFound(updateTask(id, data))),

  delete: publicProcedure.input(taskId).mutation(({ input }) => {
    orNotFound(deleteTask(input.id));
    return { id: input.id };
  }),
});
