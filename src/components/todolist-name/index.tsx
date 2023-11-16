import { FormEvent, memo, useCallback, useEffect, useState } from "react";

const SESSION_STORAGE_KEY = "todoListName";
const DEFAULT_VALUE = "Please, enter the name of your task list";

export const TodoListName = memo(function TodoListName() {
  const [value, setValue] = useState("");

  const input = useCallback((event: FormEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    document.title = nextValue;
    sessionStorage.setItem(SESSION_STORAGE_KEY, nextValue);
    setValue(nextValue);
  }, []);

  const restore = useCallback(() => {
    if (!value) {
      setValue(DEFAULT_VALUE);
    }
  }, [value]);

  useEffect(() => {
    const defaultValue =
      sessionStorage.getItem(SESSION_STORAGE_KEY) || DEFAULT_VALUE;
    document.title = defaultValue;
    setValue(defaultValue);
  }, []);

  return (
    <div className="min-w-max mb-7">
      <label className="text-gray-500 font-semibold grid text-center uppercase text-xl">
        TodoList Name
        <input
          onInput={input}
          onBlur={restore}
          className="text-center text-gray-800 outline-none border-2 border-transparent focus:border-blue-400 hover:border-blue-400 rounded-md p-2 w-full font-bold text-xl"
          type="text"
          value={value}
        />
      </label>
    </div>
  );
});
