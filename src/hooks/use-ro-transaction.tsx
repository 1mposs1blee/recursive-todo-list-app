import { IndexedDBContext } from "contexts/indexed-db-context";
import { promisify } from "helpers/promisify";
import { useCallback, useContext } from "react";
import {
  createTransaction,
  CreateTransactionParams,
} from "indexed-db/create-transaction";

export function useROTransaction<T>(name: CreateTransactionParams["name"]): {
  getAll: (parent?: IDBValidKey | IDBKeyRange) => Promise<T[]>;
} {
  const { store } = useContext(IndexedDBContext);

  const getAll = useCallback(
    (parent?: IDBValidKey | IDBKeyRange): Promise<T[]> => {
      const transaction = createTransaction({ store, type: "readonly", name });
      let request: IDBRequest;

      if (parent) {
        request = transaction.index("parent_index").getAll(parent);
      } else {
        request = transaction.getAll();
      }

      return promisify(request);
    },

    [name, store]
  );

  return { getAll };
}
