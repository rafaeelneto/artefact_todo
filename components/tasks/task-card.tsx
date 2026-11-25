import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";
import { type Task } from "@/server/tasks/schema";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.titulo}</CardTitle>
        {task.descricao && (
          <CardDescription className="line-clamp-3">{task.descricao}</CardDescription>
        )}
        <time dateTime={task.dataCriacao.toISOString()} className="text-xs text-muted-foreground">
          {formatDate(task.dataCriacao)}
        </time>
        <CardAction className="flex gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/tasks/${task.id}/edit`}>
              <PencilIcon />
              Editar
            </Link>
          </Button>
          <DeleteTaskButton id={task.id} titulo={task.titulo} />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
