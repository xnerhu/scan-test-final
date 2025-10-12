import express from "express";
import { spawn } from "child_process";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Command Runner is up and running!");
});

app.post("/", (req, res) => {
  const { command } = req.body ?? {};

  const child = spawn(command, { shell: true });

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (chunk) => (stdout += chunk));
  child.stderr.on("data", (chunk) => (stderr += chunk));

  child.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });

  child.on("close", (code) => {
    res.json({ command, returncode: code, stdout, stderr });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Command runner listening on ${PORT}`)
);
