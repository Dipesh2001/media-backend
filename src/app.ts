import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import adminRoutes from "./routes/admin-routes"
import artistRoutes from "./routes/artist-routes"
import albumRoutes from "./routes/album-routes"
import songRoutes from "./routes/song-routes"
import playlistRoutes from "./routes/playlist-routes"

import { errorHandler } from "./middleware/error-handler";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors( {origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser()); 

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/admin", adminRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/album", albumRoutes); 
app.use("/api/song", songRoutes); 
app.use("/api/playlist", playlistRoutes); 

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express");
});


app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
