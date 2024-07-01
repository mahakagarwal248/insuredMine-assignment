import { parentPort, workerData } from "worker_threads";

parentPort.postMessage({
  message: `Data has been processed.`,
  data: workerData,
});
