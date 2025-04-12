"use strict";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./contactRoutes.js";
// convert module path to dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Initialize express
const app = express();
const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`[INFO] App running on port: http://localhost:${port}`);
        });
    }
    catch (e) {
        console.error(`[ERROR] Failed to start node server: ${e}`);
        process.exit(1);
    }
};
// Middleware to parse incoming json payloads
app.use(express.json());
// Serve static files (HTML, CSS, etc...) from the project root
app.use(express.static(path.join(__dirname, '../..')));
// Serve more static files from node_modules for client-side use (map)
app.use("/node_modules/@fortawesome/fontawesome-free", express.static(path.join(__dirname, '../../node_modules/@fortawesome/fontawesome-free')));
app.use("/node_modules/bootstrap", express.static(path.join(__dirname, '../../node_modules/bootstrap')));
// Mount all contact endpoints to path /api/contacts
app.use('/api/contacts', contactRoutes);
const users = [
    {
        DisplayName: "bobsmith",
        EmailAddress: "bob.smith@gmail.com",
        Username: "bobsmitty",
        Password: "bob123"
    },
    {
        DisplayName: "admin",
        EmailAddress: "admin@gmail.com",
        Username: "admin",
        Password: "password"
    }
];
// Route to server the home page / landing page of our SPA (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../..', 'index.html'));
});
app.get("/users", (req, res) => {
    res.send({ users });
});
// Start the server
// FIXED - SERGIO
// NEEDS TO String Literal Escaping (ie single quotes)
await startServer();
//# sourceMappingURL=server.js.map