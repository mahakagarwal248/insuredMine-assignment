import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import { storeInSchema } from "./storeData.js";

export function runWorker(data) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const workerPath = path.resolve(__dirname, "./dataProcessor.js");

  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, {
      workerData: { data },
    });

    worker.on("message", async (message) => {
      const response = await storeInSchema(message?.data);
      resolve(response);
    });
    worker.on("error", (error) => reject(error));
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
