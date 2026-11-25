import { describe, expect, it } from "vitest";

import { taskInput } from "@/server/tasks/schema";

describe("taskInput", () => {
  it("rejects an empty title", () => {
    expect(taskInput.safeParse({ titulo: "" }).success).toBe(false);
  });

  it("rejects a whitespace-only title", () => {
    expect(taskInput.safeParse({ titulo: "   " }).success).toBe(false);
  });

  it("trims fields and turns an empty description into undefined", () => {
    expect(taskInput.parse({ titulo: "  Café  ", descricao: "" })).toEqual({
      titulo: "Café",
      descricao: undefined,
    });
  });

  it("rejects a title longer than 120 characters", () => {
    expect(taskInput.safeParse({ titulo: "a".repeat(121) }).success).toBe(false);
  });

  it("rejects a description longer than 1000 characters", () => {
    expect(taskInput.safeParse({ titulo: "ok", descricao: "a".repeat(1001) }).success).toBe(false);
  });
});
