const { Sequelize, STRING, VIRTUAL } = require("sequelize");
const db = new Sequelize("postgres://localhost/dealers_choice_spa");

const ShoppingList = db.define("shoppinglist", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
});

const Category = db.define("category", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

//creates a foreign key: categoryId in ShoppingList
ShoppingList.belongsTo(Category);

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    const [
      avocado,
      wine,
      cheese,
      steak,
      lobster,
      chocolate,
      refrigerator,
      oven,
      grill,
      chandelier,
      sofa,
    ] = await Promise.all(
      [
        "avocado",
        "wine",
        "cheese",
        "steak",
        "lobster",
        "chocolate",
        "refrigerator",
        "oven",
        "grill",
        "chandelier",
        "sofa",
      ].map((item) => ShoppingList.create({ name: `${item}` }))
    );

    const [groceries, appliances] = await Promise.all(
      ["groceries", "appliances"].map((category) =>
        Category.create({ name: `${category}` })
      )
    );

    await avocado.setCategory(groceries);
    await wine.setCategory(groceries);
    await cheese.setCategory(groceries);
    await steak.setCategory(groceries);
    await lobster.setCategory(groceries);
    await chocolate.setCategory(groceries);
    await refrigerator.setCategory(appliances);
    await oven.setCategory(appliances);
    await grill.setCategory(appliances);
    await chandelier.setCategory(appliances);
    await sofa.setCategory(appliances);
  } catch (err) {
    next(err);
  }
};

syncAndSeed();

const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;

app.listen(port, console.log(`listning on port ${port}`));
app.use("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/src", express.static(path.join(__dirname, "/src")));

module.exports = ShoppingList;
