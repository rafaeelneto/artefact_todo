"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type TRPCClientErrorLike } from "@trpc/client";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type AppRouter } from "@/server/routers/_app";
import { type Task, taskInput } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";

export function TaskForm({ task }: { task?: Task }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(taskInput),
    defaultValues: { titulo: task?.titulo ?? "", descricao: task?.descricao ?? "" },
  });
  const { errors } = form.formState;

  const handlers = {
    onSuccess: async () => {
      toast.success(task ? "Tarefa atualizada" : "Tarefa criada");
      await queryClient.invalidateQueries({ queryKey: trpc.task.pathKey() });
      router.push("/");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      const fieldErrors = error.data?.zodError?.fieldErrors;
      let shown = false;
      for (const field of ["titulo", "descricao"] as const) {
        const message = fieldErrors?.[field]?.[0];
        if (message) {
          form.setError(field, { message });
          shown = true;
        }
      }
      if (!shown) toast.error(error.message);
    },
  };
  const create = useMutation(trpc.task.create.mutationOptions(handlers));
  const update = useMutation(trpc.task.update.mutationOptions(handlers));
  const busy = create.isPending || update.isPending || create.isSuccess || update.isSuccess;

  const onSubmit = form.handleSubmit((values) => {
    if (task) update.mutate({ id: task.id, ...values });
    else create.mutate(values);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          autoFocus
          aria-invalid={!!errors.titulo}
          aria-describedby={errors.titulo ? "titulo-error" : undefined}
          {...form.register("titulo")}
        />
        {errors.titulo && (
          <p id="titulo-error" role="alert" className="text-sm text-destructive">
            {errors.titulo.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="descricao">Descrição (opcional)</Label>
        <Textarea
          id="descricao"
          rows={5}
          aria-invalid={!!errors.descricao}
          aria-describedby={errors.descricao ? "descricao-error" : undefined}
          {...form.register("descricao")}
        />
        {errors.descricao && (
          <p id="descricao-error" role="alert" className="text-sm text-destructive">
            {errors.descricao.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2Icon className="animate-spin" />}
          {busy ? "Salvando…" : task ? "Salvar alterações" : "Criar tarefa"}
        </Button>
      </div>
    </form>
  );
}
