import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { TaskList } from "@/components/tasks/task-list";
import { TaskListSkeleton } from "@/components/tasks/task-list-skeleton";
import { Button } from "@/components/ui/button";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default function HomePage() {
  void getQueryClient()
    .infiniteQuery(
      trpc.task.list.infiniteQueryOptions(
        { limit: 10 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor },
      ),
    )
    .catch(() => {});

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Tarefas</h1>
        <Button asChild>
          <Link href="/tasks/new">
            <PlusIcon />
            Nova tarefa
          </Link>
        </Button>
      </header>
      <HydrateClient>
        <Suspense fallback={<TaskListSkeleton />}>
          <TaskList />
        </Suspense>
      </HydrateClient>
    </main>
  );
}
