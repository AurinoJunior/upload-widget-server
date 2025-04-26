const { exec } = require("node:child_process")

function handleReturn(_error, stdout) {
  if (stdout.search("accepting connections") === -1) {
    process.stdout.write(".")
    setTimeout(checkPostgres, 500) // tenta de novo em 0.5s
    return
  }

  process.stdout.write("\n🟢 Postgres está pronto e aceitando conexões!\n")
}

function checkPostgres() {
  // Roda o comando, solta o log e encerra.
  exec("docker exec postgres pg_isready --host localhost", handleReturn)
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões")
checkPostgres()
