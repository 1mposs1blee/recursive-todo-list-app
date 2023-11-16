import {
  TodoStoreActions,
  TodoStoreContext,
} from "contexts/todo-store-context";
import { createTodo, Todo } from "helpers/create-todo";
import { useRWTransaction } from "hooks/use-rw-transaction";
import { memo, useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

type FormValues = {
  desc: string;
};

export type TodoFormProps = {
  parent: string;
};

export const TodoForm = memo(function TodoForm({ parent }: TodoFormProps) {
  const {
    state: { todos },
    dispatch,
  } = useContext(TodoStoreContext);

  const { add } = useRWTransaction<Partial<Todo>>("todos");

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      desc: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const submit = useCallback(
    async ({ desc }: FormValues) => {
      const targetTodos = todos[parent];
      const nextOrder = (targetTodos[targetTodos.length - 1]?.order ?? 0) + 1;
      const todo = createTodo({ desc, order: nextOrder, parent });

      await add(todo);
      dispatch({ type: TodoStoreActions.ADD_TODO, payload: todo });

      reset();
    },
    [add, dispatch, parent, reset, todos]
  );

  return (
    <form
      className="flex flex-col w-full"
      autoComplete="off"
      onSubmit={handleSubmit(submit)}
    >
      <label className="flex flex-col text-sm text-gray-500">
        <span className="pb-2">What to do?</span>
        <div className="flex">
          <input
            className={classNames(
              "p-2 flex-grow font-medium text-lg text-gray-800 border-2 border-gray-600 hover:border-blue-400 focus:border-blue-400 outline-none rounded-md",
              { "border-red-400": formState.errors.desc }
            )}
            type="text"
            {...register("desc", {
              required: true,
              maxLength: 20,
              minLength: 5,
            })}
          />
          <button
            type="submit"
            className="p-2 ml-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
        {formState.errors.desc && (
          <p className="text-red-500 text-sm">
            {formState.errors.desc.type === "required" &&
              "Todo desc is a required field"}
            {formState.errors.desc.type === "minLength" &&
              "Todo desc is too short, must be at least 5 characters long"}
            {formState.errors.desc.type === "maxLength" &&
              "Todo desc is too long, must not be longer than 20 characters"}
          </p>
        )}
      </label>
    </form>
  );
});
