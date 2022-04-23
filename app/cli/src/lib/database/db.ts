import lodash from "lodash";
import { Low, JSONFile } from "lowdb";

type Connection = {
  v1Address: string;
  from: string;
  to: string;
  batch: number | null;
  txId: string | null;
  status: "pending" | "confirmed" | "failed";
};

type Data = {
  connections: Connection[];
};

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

const adapter = new JSONFile<Data>("db.json");
export const db = new LowWithLodash(adapter);
