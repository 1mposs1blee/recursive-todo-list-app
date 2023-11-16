import {
  memo,
  useCallback,
  useState,
  useEffect,
  KeyboardEvent,
  useContext,
  DragEvent,
} from "react";
import Image from "next/image";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { Todo } from "helpers/create-todo";
import { useRWTransaction } from "hooks/use-rw-transaction";
import { useROTransaction } from "hooks/use-ro-transaction";
import {
  TodoStoreActions,
  TodoStoreContext,
} from "contexts/todo-store-context";
import { TodoForm } from "components/todo-form";
import { TodoList } from "components/todo-list";
import { RemoveButton } from "components/remove-button";

export type TodoItemProps = {
  todo: Todo;
};

type FormValues = {
  desc: string;
};

export const TodoItem = memo(function Todo({ todo }: TodoItemProps) {
  const { put, remove } = useRWTransaction<Todo>("todos");
  const [readOnly, setReadOnly] = useState(true);
  const [draggable, setDraggable] = useState(false);
  const [isSubTodosShown, setIsSubTodosShown] = useState(false);

  const {
    state: { draggableTodo, todos },
    dispatch,
  } = useContext(TodoStoreContext);

  const { getAll } = useROTransaction<Todo>("todos");

  useEffect(() => {
    getAll(todo.id)
      .then((todos = []) => {
        dispatch({
          type: TodoStoreActions.INIT_TODOS,
          payload: { parent: todo.id, todos },
        });
      })
      .catch(console.error);
  }, [dispatch, getAll, todo.id]);

  const { register, getValues } = useForm<FormValues>({
    defaultValues: {
      desc: todo.desc,
    },
  });

  const startEditing = useCallback(() => {
    setReadOnly(false);
  }, []);

  const toggleReadOnlyOnPressEnter = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setReadOnly((previous) => !previous);
      }
    },
    []
  );

  const saveChanges = useCallback(() => {
    const nextTodo = { ...todo, desc: getValues("desc") };
    setReadOnly(true);
    put(nextTodo);
    dispatch({ type: TodoStoreActions.UPDATE_TODO, payload: nextTodo });
  }, [dispatch, getValues, put, todo]);

  const deleteTodo = useCallback(() => {
    remove(todo.id);
    dispatch({
      type: TodoStoreActions.REMOVE_TODO,
      payload: { parent: todo.parent, self: todo.id },
    });
  }, [dispatch, remove, todo.id, todo.parent]);

  const startDragging = useCallback(() => {
    dispatch({ type: TodoStoreActions.SET_DRAGGABLE_TODO, payload: todo });
  }, [dispatch, todo]);

  const endDragging = useCallback(() => {
    dispatch({ type: TodoStoreActions.SET_DRAGGABLE_TODO, payload: null });
  }, [dispatch]);

  const dragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const dragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const dragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const drop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (
        draggableTodo &&
        todo.order !== draggableTodo.order &&
        todo.parent === draggableTodo.parent
      ) {
        const currentTodo = { ...draggableTodo, order: todo.order };
        const targetTodo = { ...todo, order: draggableTodo.order };
        await put(currentTodo);
        await put(targetTodo);
        dispatch({ type: TodoStoreActions.UPDATE_TODO, payload: currentTodo });
        dispatch({ type: TodoStoreActions.UPDATE_TODO, payload: targetTodo });
      }
    },

    [dispatch, draggableTodo, put, todo]
  );

  const toggleSubTodos = useCallback(() => {
    setIsSubTodosShown((previous) => !previous);
  }, []);

  return (
    <div
      className={classNames(
        "grid grid-flow-row items-center gap-y-3 rounded-md p-2"
      )}
      draggable={draggable}
      onDragStartCapture={startDragging}
      onDragEndCapture={endDragging}
      onDragEnterCapture={dragEnter}
      onDragOverCapture={dragOver}
      onDragLeaveCapture={dragLeave}
      onDropCapture={drop}
    >
      <div className="grid grid-flow-col gap-x-2 items-center">
        <div className="justify-self-center w-10">
          <span className="truncate">{todos[todo.id]?.length || ""}</span>
          <button
            className={classNames("ml-2 transform transition-transform", {
              "rotate-0": !isSubTodosShown,
              "rotate-90": isSubTodosShown,
            })}
            onClick={toggleSubTodos}
          >
            <span>&gt;</span>
          </button>
        </div>

        <input
          className={classNames(
            "p-2 w-full outline-none border border-transparent rounded-md transition-colors bg-gray-100",
            {
              "hover:border-gray-500 focus:border-gray-500": readOnly,
              "border-blue-500": !readOnly,
            }
          )}
          type="text"
          {...register("desc", { required: true, minLength: 5, maxLength: 20 })}
          onClick={startEditing}
          onKeyUp={toggleReadOnlyOnPressEnter}
          onBlur={saveChanges}
          readOnly={readOnly}
        />

        <RemoveButton click={deleteTodo} />

        <Image
          className="cursor-grab"
          draggable={false}
          onMouseEnter={() => setDraggable(true)}
          onMouseLeave={() => setDraggable(false)}
          style={{ width: "15px", height: "15px" }}
          width="15"
          height="15"
          src="/drag.svg"
          alt="drag indicator"
        />
      </div>

      {isSubTodosShown && (
        <div className="grid grid-flow-row pl-10 gap-y-3">
          <TodoForm parent={todo.id} />
          <TodoList parent={todo.id} shouldRunUseEffect={false} />
        </div>
      )}
    </div>
  );
});
