import type { AppProps } from "next/app";
import { useCallback } from "react";
import { IndexedDBContextProvider } from "contexts/indexed-db-context";
import { TodoStoreContextProvider } from "contexts/todo-store-context";
import "tailwindcss/tailwind.css";

function App({ Component, pageProps }: AppProps) {
  const init = useCallback((dbInstance: IDBDatabase) => {
    const todos = dbInstance.createObjectStore("todos", { keyPath: "id" });

    todos.createIndex("parent_index", "parent");
  }, []);

  return (
    <IndexedDBContextProvider init={init}>
      <TodoStoreContextProvider>
        <Component {...pageProps} />
      </TodoStoreContextProvider>
    </IndexedDBContextProvider>
  );
}

export default App;
