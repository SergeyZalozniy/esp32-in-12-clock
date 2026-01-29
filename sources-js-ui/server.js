import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3831;
const WS_PORT = 8081;

// HTTP server for serving static files
const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    "dist",
    req.url === "/" ? "index.html" : req.url
  );

  // Handle query parameters
  if (req.url.includes("?")) {
    filePath = path.join(
      __dirname,
      "dist",
      req.url.split("?")[0] || "index.html"
    );
  }

  // Default to index.html if file doesn't exist
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, "dist", "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  const contentType = contentTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404);
        res.end("File not found");
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// WebSocket server
const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    let messageStr;
    
    if (Buffer.isBuffer(message)) {
      // Binary message - convert to string
      messageStr = message.toString('utf-8');
      console.log(`Received binary message: ${message.length} bytes, content: "${messageStr}"`);
    } else {
      // Text message
      messageStr = message;
      console.log(`Received text message: "${messageStr}"`);
    }

    // Parse command (first character code)
    const command = messageStr.charCodeAt(0);
    const data = messageStr.substring(1);
    console.log(`WebSocket message - Command: ${command}, Data: ${data}`);

    // Handle CUSTOM_TIME command
    if (command === 14) {
      // CUSTOM_TIME
      const timestamp = parseInt(data, 10);
      const date = new Date(timestamp * 1000);
      console.log(
        `✅ Setting custom time: ${date.toISOString()} (timestamp: ${timestamp})`
      );
      // Echo back or handle as needed
      ws.send(String.fromCharCode(14) + data);
    }
    
    // Handle BACKLIGHT_COLOR command
    if (command === 15) {
      // BACKLIGHT_COLOR
      console.log(`✅ Setting backlight color: ${data}`);
      // Echo back or handle as needed
      ws.send(String.fromCharCode(15) + data);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${WS_PORT}/`);
  console.log(`Open http://localhost:${PORT}/?page=clock to test`);
});
