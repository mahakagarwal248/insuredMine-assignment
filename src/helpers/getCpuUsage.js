import os from "os-utils";

export const getUsage = () => {
  return new Promise((resolve, reject) => {
    os.cpuUsage((cpuUsage) => {
      const usage = (cpuUsage * 100).toFixed(2);
      resolve(usage);
    });
  });
};