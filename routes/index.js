const itemRoutes = require("./items");
const bidItemRoutes = require("./bidItems");
const constructorMethod = app => {
  app.use("/items", itemRoutes);
  app.use("/bidItems", bidItemRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;