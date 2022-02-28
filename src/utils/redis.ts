import { createClient } from "redis";

const client = createClient();

(async () => {
  await client.connect();
  console.log("Connected to redis");
})();

client.on("end", () => console.log("Redis disconneected"));

export default client;
