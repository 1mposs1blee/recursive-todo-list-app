import { memo, useContext, useEffect } from "react";
import type { Todo } from "helpers/create-todo";
import { TodoItem } from "components/todo-item";
import { useROTransaction } from "hooks/use-ro-transaction";
import {
  TodoStoreActions,
  TodoStoreContext,
} from "contexts/todo-store-context";

export type TodoListProps = {
  parent: string;
  shouldRunUseEffect?: boolean;
};

export const TodoList = memo(function TodoList({
  parent,
  shouldRunUseEffect = true,
}: TodoListProps) {
  const {
    state: { todos },
    dispatch,
  } = useContext(TodoStoreContext);

  const { getAll } = useROTransaction<Todo>("todos");

  useEffect(() => {
    if (shouldRunUseEffect) {
      getAll(parent)
        .then((todos = []) => {
          dispatch({
            type: TodoStoreActions.INIT_TODOS,
            payload: { parent, todos },
          });
        })
        .catch(console.error);
    }
  }, [dispatch, getAll, parent, shouldRunUseEffect]);

  return (
    <ul className="grid grid-flow-row gap-y-3 w-full max-w-xl justify-self-center">
      {(todos[parent] ?? []).map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} />
        </li>
      ))}
    </ul>
  );
});
