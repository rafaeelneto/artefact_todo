import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";

import { TaskForm } from "@/components/tasks/task-form";
import { getQueryClient, trpc } from "@/trpc/server";

async function loadTask(id: string) {
  try {
    return await getQueryClient().query(trpc.task.byId.queryOptions({ id }));
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await loadTask(id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Editar tarefa</h1>
      <TaskForm task={task} />
    </main>
  );
}
