"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const admin_routes_1 = __importDefault(require("./routes/admin-routes"));
const artist_routes_1 = __importDefault(require("./routes/artist-routes"));
const album_routes_1 = __importDefault(require("./routes/album-routes"));
const error_handler_1 = require("./middleware/error-handler");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/admin", admin_routes_1.default);
app.use("/api/artist", artist_routes_1.default);
app.use("/api/album", album_routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express");
});
app.use(error_handler_1.errorHandler);
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
