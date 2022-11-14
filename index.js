import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import route from "./routes/ProductRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(route);

app.listen(5000, () => {
  console.log(`App runinng at http://localhost:5000`);
});
