import express from "express";
import cors from "cors";
import api from "../controllers/api/index.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api", api);

export default app;