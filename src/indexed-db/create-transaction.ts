export type CreateTransactionParams = {
  store: IDBDatabase;
  name: "todos";
  type: IDBTransactionMode;
};

export const createTransaction = ({
  store,
  type,
  name,
}: CreateTransactionParams) => {
  return store.transaction(name, type).objectStore(name);
};
