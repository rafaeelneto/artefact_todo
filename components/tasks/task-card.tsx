import { PencilIcon } from "lucide-react";
import Link from "next/link";

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
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/tasks/${task.id}/edit`}>
              <PencilIcon />
              Editar
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
