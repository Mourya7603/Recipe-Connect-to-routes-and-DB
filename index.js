const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.model");

const app = express();
app.use(express.json());
initializeDatabase();

// 1. Create Recipe
app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    res.status(201).json({ message: "Recipe created", recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

// 2. Get all recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// 3. Get recipe by title
app.get("/recipes/title/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    recipe ? res.json(recipe) : res.status(404).json({ error: "Recipe not found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// 4. Get recipes by author
app.get("/recipes/author/:author", async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.author });
    recipes.length ? res.json(recipes) : res.status(404).json({ error: "No recipes found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// 5. Get recipes by difficulty
app.get("/recipes/difficulty/:level", async (req, res) => {
  try {
    const recipes = await Recipe.find({ difficulty: req.params.level });
    recipes.length ? res.json(recipes) : res.status(404).json({ error: "No recipes found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// 6. Update difficulty by ID
// 6. Update difficulty by recipe ID
app.post("/recipes/:id/difficulty", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { difficulty: req.body.difficulty },
      { new: true }
    );
    updatedRecipe
      ? res.json(updatedRecipe)
      : res.status(404).json({ error: "Recipe not found" });
  } catch {
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// 7. Update prep & cook time by title
app.post("/recipes/title/:title/times", async (req, res) => {
  try {
    const updated = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      {
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
      },
      { new: true }
    );
    updated
      ? res.json(updated)
      : res.status(404).json({ error: "Recipe not found" });
  } catch {
    res.status(500).json({ error: "Failed to update times" });
  }
});


// 8. Delete recipe by ID
app.delete("/recipes/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    deleted ? res.json({ message: "Recipe deleted" }) : res.status(404).json({ error: "Recipe not found" });
  } catch {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

// Start server
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
