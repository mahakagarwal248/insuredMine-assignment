import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

export const restartServer = () => {
  console.log("Restarting server...");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectDir = path.resolve(__dirname, "../../");

  const command = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "start"],
    { cwd: projectDir, shell: true }
  );

  command.stdout.on("data", (data) => {
    process.stdout.write(data.toString());
  });

  command.stderr.on("data", (data) => {
    process.stderr.write(data.toString());
  });

  command.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
  });
};
