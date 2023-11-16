import { promisify } from "helpers/promisify";

export type OpenIndexedDBParams = {
  name: string;
  version: number;
  init: (databaseInstance: IDBDatabase) => void;
};

export const openIndexedDB = ({
  name,
  version,
  init,
}: OpenIndexedDBParams): Promise<IDBDatabase> => {
  const request = indexedDB.open(name, version);

  request.onupgradeneeded = () => {
    init(request.result);
  };

  return promisify(request);
};
