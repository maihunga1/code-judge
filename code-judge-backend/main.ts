import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; img-src 'self' data:;"
  );
  next();
});

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
