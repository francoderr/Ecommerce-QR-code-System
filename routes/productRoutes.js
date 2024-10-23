const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");

// in-memory product storage (we'll replace this with a database)
let products = [
  {
    id: 1,
    name: "Men's Suites",
    category: "men",
    price: 140,
    stock: 20,
    image: "/images/mens-suits.jpg",
  },
  {
    id: 2,
    name: "Women's Suits",
    category: "ladies",
    price: 240,
    stock: 20,
    image: "/images/women-ware.jpg",
  },
  {
    id: 3,
    name: "Men's Wear",
    category: "men",
    price: 150,
    stock: 5,
    image: "/images/mens-ware.jpg",
  },
  {
    id: 4,
    name: "Women's bag",
    category: "ladies",
    price: 600,
    stock: 20,
    image: "/images/women-bags.jpg",
  },
  {
    id: 5,
    name: "Women's Staff",
    category: "ladies",
    price: 500,
    stock: 10,
    image: "/images/women-staffs.jpg",
  },
];

// gets all products
router.get("/products", (req, res) => {
  res.render("products", { products: products });
});

// get products by category
router.get("/products/category/:category", (req, res) => {
  const category = req.params.category.toLowerCase();
  const filteredProducts = products.filter((p) =>
    p.category.toLocaleLowerCase().includes(category),
  );
  if (filteredProducts.length > 0) {
    res.render("products", { products: filteredProducts });
  } else {
    res.status(404).send("No products found in this category");
  }
});

// get a single product by id
router.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (product) {
    return res.render("productDetail", { product: product });
  }
  return res.status(404).send("Product not found");
});

// add a product to the cart
router.post("/cart/add", (req, res) => {
  const productId = parseInt(req.body.productId);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).send("Product not found");
  }

  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push(product);
  res.redirect("/cart");
});

// route to display cart
router.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  res.render("cart", { cart: cart });
});

// handle checkout and generate qr code
router.post("/checkout", (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.redirect("/cart");
  }

  // generate a qr code for the cart items
  const cartDetails = cart
    .map((product) => `${product.name}: ${product.price}`)
    .join(",");
  QRCode.toDataURL(cartDetails, (err, url) => {
    if (err) {
      return res.status(500).send("Failed to generate QR Code");
    }

    // clear cart after checkout
    req.session.cart = [];

    // render the checkout page with the qr code
    res.render("checkout", { qrCodeUrl: url });
  });
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
  res.status(201).json(newProduct);
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
