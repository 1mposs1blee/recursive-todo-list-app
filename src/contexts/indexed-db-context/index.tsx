import {
  createContext,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { openIndexedDB, OpenIndexedDBParams } from "indexed-db";
import getConfig from "next/config";
import { nanoid } from "nanoid";

const { publicRuntimeConfig } = getConfig();
const DB_NAME_SESSION_STORAGE_KEY = "databaseName";

export type IndexedDBContextValue = {
  store: IDBDatabase;
};

export const IndexedDBContext = createContext<IndexedDBContextValue>({
  store: {} as IDBDatabase,
});

export type IndexedDBContextProviderProps = {
  init: OpenIndexedDBParams["init"];
  children: ReactNode;
};

export const IndexedDBContextProvider = memo(function IndexedDBContextProvider({
  init,
  children,
}: IndexedDBContextProviderProps) {
  const [store, setStore] = useState<IDBDatabase | null>(null);
  const [error, setError] = useState<DOMException | null>(null);

  const initStore = useCallback(
    async (databaseName: string) => {
      try {
        setStore(
          await openIndexedDB({
            name: databaseName,
            version: publicRuntimeConfig.DB_VERSION,
            init,
          })
        );
      } catch (error) {
        if (error instanceof DOMException) {
          setError(error);
        } else {
          throw error;
        }
      }
    },
    [init]
  );

  useEffect(() => {
    let databaseName = sessionStorage.getItem(DB_NAME_SESSION_STORAGE_KEY);

    if (!databaseName) {
      databaseName = nanoid();
      sessionStorage.setItem(DB_NAME_SESSION_STORAGE_KEY, databaseName);
    }

    initStore(databaseName);
  }, [initStore]);

  if (!store) {
    return null;
  }

  if (error) {
    console.error(error);
    return <p>{error.message}</p>;
  }

  return (
    <IndexedDBContext.Provider value={{ store }}>
      {children}
    </IndexedDBContext.Provider>
  );
});
