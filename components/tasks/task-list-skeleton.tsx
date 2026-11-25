import { Skeleton } from "@/components/ui/skeleton";

export function TaskListSkeleton() {
  return (
    <ul className="flex flex-col gap-3" aria-busy="true" aria-label="Carregando tarefas">
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index}>
          <Skeleton className="h-24 rounded-xl" />
        </li>
      ))}
    </ul>
  );
}
