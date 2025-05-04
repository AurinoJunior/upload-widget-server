const { spawn } = require("node:child_process");

// Executa de forma sequencial
const commandsToRunTests = [
  "yarn services:up",
  "node scripts/wait-for-db.js",
  "node scripts/reset-db.js",
  "yarn db:migrate:test",
  "dotenv -e .env.test -- vitest run",
].join(" && ");

spawn(commandsToRunTests, { stdio: "inherit", shell: true });

function servicesStop() {
  console.warn("Encerrando...");

  spawn("yarn services:stop", {
    detached: true, // continua executando mesmo depois de encerrar o processo principal.
    shell: true,
    windowsHide: true,
    stdio: "ignore",
  });
}

process.on("SIGINT", servicesStop); // SIGINT -> Sinal de saida forçada Ex: ctrl+c
process.on("SIGTERM", servicesStop); // SIGTERM -> Sinal de saida normal.
process.on("exit", servicesStop); // Exit -> Sinal de saida natural.
