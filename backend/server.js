const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const taskRouter = require("./routes/taskRoutes.js");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/tasks", taskRouter);

app.get("/", (req, res) => {
    res.send("Server is running");
})

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on the port ${PORT}`);
    })
}

startServer();

