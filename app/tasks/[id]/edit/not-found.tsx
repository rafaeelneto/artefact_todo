import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function TaskNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Tarefa não encontrada</h1>
      <p className="text-muted-foreground">Ela pode ter sido excluída ou o link está incorreto.</p>
      <Button asChild variant="outline">
        <Link href="/">Voltar para a lista</Link>
      </Button>
    </main>
  );
}
