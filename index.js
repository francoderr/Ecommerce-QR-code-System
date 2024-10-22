const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

const productRoutes = require("./routes/productRoutes");

app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.send("Boutique backend API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
