"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { TaskCard } from "@/components/tasks/task-card";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

export function TaskList() {
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    ),
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingNextPage) void fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const tasks = data.pages.flatMap((page) => page.items);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
        <p className="text-muted-foreground">Nenhuma tarefa ainda</p>
        <Button asChild variant="outline">
          <Link href="/tasks/new">Criar a primeira tarefa</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} className="flex justify-center py-6 text-sm text-muted-foreground">
        {isFetchingNextPage ? (
          <span className="flex items-center gap-2">
            <Loader2Icon className="size-4 animate-spin" />
            Carregando mais…
          </span>
        ) : (
          !hasNextPage && "Não há mais tarefas"
        )}
      </div>
    </>
  );
}
