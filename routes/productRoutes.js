const express = require("express");
const router = express.Router();

// in-memory product storage (we'll replace this with a database)
let products = [
  {
    id: 1,
    name: "Men's Suites",
    category: "men's wear",
    price: 140,
    stock: 20,
    image: "/images/mens-suits.jpg",
  },
  {
    id: 2,
    name: "Women's Suits",
    category: "women's wear",
    price: 240,
    stock: 20,
    image: "/images/women-ware.jpg",
  },
];

// gets all products
router.get("/products", (req, res) => {
  res.render("products", { products: products });
});

// get a single product by id
router.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (product) {
    return res.render("productDetail", { product: product });
  }
  return res.status(404).send("Product not found");
});

// add a new product
router.post("/products", (req, res) => {
  const newProduct = {
    id: products.length + 1, //id generation replace with db later
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock,
    image: req.body.image,
  };

  products.push(newProduct);
  res.status(201).render(newProduct);
});

// update a product
router.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).send("Product not found");
  }
  product.name = req.body.name || product.name;
  product.category = req.body.category || product.category;
  product.price = req.body.price || product.price;
  product.stock = req.body.stock || product.stock;
  //   res.json(product);
  res.render("productDetail", { product: product });
});

// delete a product
router.delete("/products/:id", (req, res) => {
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.id),
  );
  if (productIndex === -1) {
    return res.status(404).send("Product not found");
  }
  products.splice(productIndex, 1);
  res.status(204).send();
});

module.exports = router;
