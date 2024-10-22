const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.send("Boutique backend API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
