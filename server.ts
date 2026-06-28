import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Initialize data
let appData = {
  items: [],
  repairs: [],
  borrows: [],
  users: []
};

// We can seed it with the default data from data.ts, but let's just use what the client sends.

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/data", (req, res) => {
    res.json(appData);
  });

  app.post("/api/data", (req, res) => {
    appData = { ...appData, ...req.body };
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
