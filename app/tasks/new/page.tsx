import { TaskForm } from "@/components/tasks/task-form";

export default function NewTaskPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Nova tarefa</h1>
      <TaskForm />
    </main>
  );
}
