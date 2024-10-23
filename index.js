const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    secret:
      "8139110896719cbeffb5a0a5e9b157f1b17779579a563626dd7c2b6b92d46b3b4bc5e688f2e4b55ad4fc550f606f9f4859baa02ef1f7ef251111597066e87886",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use("/", productRoutes);

app.get("/", (req, res) => {
  res.send("Boutique backend API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
