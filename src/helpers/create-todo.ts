import { nanoid } from "nanoid";

export type Todo = {
  id: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  desc: string;
  parent?: string;
};

type CreateTodoParams = {
  desc: string;
  order: number;
  parent?: string;
};

export const createTodo = ({
  desc,
  order,
  parent,
}: CreateTodoParams): Partial<Todo> => ({
  id: nanoid(),
  order,
  createdAt: new Date().toUTCString(),
  updatedAt: new Date().toUTCString(),
  desc,
  parent: parent ?? "root",
});
