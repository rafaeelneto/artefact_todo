import { z } from "zod";

export const taskInput = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "O título é obrigatório")
    .max(120, "O título deve ter no máximo 120 caracteres"),
  descricao: z
    .string()
    .trim()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres")
    .optional()
    .transform((value) => value || undefined),
});

export const taskId = z.object({ id: z.string().min(1) });

export const listCursor = z.object({ dataCriacao: z.date(), id: z.string() });

export const listInput = z.object({
  cursor: listCursor.nullish(),
  limit: z.number().int().min(1).max(50).default(10),
});

export type TaskInput = z.output<typeof taskInput>;
export type ListCursor = z.output<typeof listCursor>;

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};
