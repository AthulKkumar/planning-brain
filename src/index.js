import app from "./config/express.js";
import connectDB from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api/v1`);
});

export default app;

