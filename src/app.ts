import express from "express";
import videoRouter from "./routes/video";

const app = express();

app.use("/", videoRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
