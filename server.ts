import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data.json");

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to load data from file:", error);
  }
  return {
    items: [],
    repairs: [],
    borrows: [],
    users: []
  };
}

function saveData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save data to file:", error);
  }
}

let appData = loadData();

// Seed default users if none exist
if (!appData.users || appData.users.length === 0) {
  appData.users = [
    { id: '1', name: 'Admin Utama', email: 'admin@simak46.com', password: 'password123', role: 'Admin', createdAt: new Date().toISOString() },
    { id: '2', name: 'Staff Gudang', email: 'staff@simak46.com', password: 'password123', role: 'Staff', createdAt: new Date().toISOString() },
  ];
  saveData(appData);
}

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
    saveData(appData);
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
