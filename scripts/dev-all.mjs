import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";

const processes = [
  {
    name: "api",
    command: "node",
    args: ["scripts/firebase-api.mjs"],
  },
  {
    name: "admin",
    command: npmCommand,
    args: ["run", "dev"],
  },
];

const children = processes.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    shell: isWindows,
  });

  child.stdout.on("data", (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(`[${name}] ${data}`);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      process.exitCode = code;
    }
  });

  return child;
});

const stop = () => {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
};

process.on("SIGINT", () => {
  stop();
  process.exit();
});

process.on("SIGTERM", () => {
  stop();
  process.exit();
});
