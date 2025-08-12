const express = require("express")
require("dotenv").config()
const cors = require("cors")
const app = express()
const { initializeConnection } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");

app.use(express.json())

initializeConnection();

app.get("/", (req, res) => {
    res.send("Hello, welcome to the world of recipes.")
})

async function addRecipe(newRecipe){
    try {
        const recipe = new Recipe(newRecipe)
        const saveRecipe = await recipe.save();
        return saveRecipe
    } catch (error) {
        throw error;
    }
}

app.post("/recipes", async (req, res) => {
    try {
        const newRecipeAdded = await addRecipe(req.body)
        res.status(201).json({message: "New recipe added successfully.", recipe: newRecipeAdded}) 
    } catch (error) {
        res.status(500).json({error: "Failed to add recipe."})
    }
})

async function getAllRecipes(){
    try {
        const allRecipes = await Recipe.find()
        return allRecipes;
    } catch (error) {
        throw error;
    }
} 

app.get("/recipes", async (req, res) => {
        try {
            const recipes = await getAllRecipes()
            if(recipes.length != 0){
                res.json(recipes)
            } else {
                res.status(404).json({error: "Recipes not found."})
            }
        } catch (error) {
                res.status(500).json({error: "Failed to fetch data."})
        }
})

async function recipeByTitle(RepTitle){
    try {
        const recipeTitle = await Recipe.findOne({title: RepTitle})
        return recipeTitle
    } catch (error) {
        throw error
    }
}

app.get("/recipes/:title", async (req, res) => {
    try {
        const titleOfRecipe = await recipeByTitle(req.params.title)
        if (titleOfRecipe) {
            res.status(201).json({message: "Recipe by title.", recipe: titleOfRecipe})
        } else {
        res.status(500).json({error: "Recipe not found."})               
        }
    } catch (error) {
        res.status(500).json({error: "Failed to find recipe by title."})
    }
})

async function recipeByAuthor(repAuthor){
    try {
        const recipeAuthor = await Recipe.find({author: repAuthor})
        return recipeAuthor        
    } catch (error) {
        throw error
    }
}


app.get("/recipes/author/:author", async (req, res) => {
    try {
        const recipeOfAuthor = await recipeByAuthor(req.params.author)
        if (recipeOfAuthor.length != 0) {
            res.status(201).json({message: "Recipes by Author.", recipe: recipeOfAuthor})
        } else {
        res.status(500).json({error: "Recipes not found."})               
        }
    } catch (error) {
        res.status(500).json({error: "Failed to find recipe by author."})
    }
})

async function recipeByDifficulty(repDifficulty){
    try {
        const recipeDifficulty = await Recipe.find({difficulty: repDifficulty})
        return recipeDifficulty        
    } catch (error) {
        throw error
    }
}


app.get("/recipes/difficulty/:difficulty", async (req, res) => {
    try {
        const recipeDifficulty = await recipeByDifficulty(req.params.difficulty)
        if (recipeDifficulty.length != 0) {
            res.status(201).json({message: "Recipes by Difficulty.", recipe: recipeDifficulty})
        } else {
        res.status(500).json({error: "Recipes not found."})               
        }
    } catch (error) {
        res.status(500).json({error: "Failed to find recipe by difficulty."})
    }
})

async function updateRecipeDifficulty(repId, dataToUpdate){
    try {
        const recipeUpdate =  await Recipe.findByIdAndUpdate(repId, dataToUpdate, {new: true})
        return recipeUpdate;
    } catch (error) {
        throw error;
    }
}

app.post("/recipes/:id", async (req, res) => {
    try {
        const updatedRecipe = await updateRecipeDifficulty(req.params.id, req.body)
        if (updatedRecipe) {
            res.status(201).json({message: "Recipe updated successfully.", updatedRecipe})
        } else {
        res.status(400).json({error: "Recipe not updated."})
        } 
    } catch (error) {
        res.status(500).json({error: "Recipe not found."})
    }
})

async function updateRecipePrepAndCookTime(repTitle, dataToUpdate){
    try {
        const recipeTimeUpdate = await Recipe.findOneAndUpdate({title: repTitle}, dataToUpdate, {new: true})
        return recipeTimeUpdate
    } catch (error) {
        throw error;
    }
}

app.post("/recipes/title/:title", async (req, res) => {
    try {
        const updatedRecipe = await updateRecipePrepAndCookTime(req.params.title, req.body)
        if (updatedRecipe) {
            res.status(201).json({message: "Recipe updated successfully.", updatedRecipe})
        } else {
        res.status(400).json({error: "Recipe not updated."})
        } 
    } catch (error) {
        res.status(500).json({error: "Recipe not found."})
    }
})

async function deleteRecipe(recipeId){
    try {
        const recipeToBeDelete = await Recipe.findByIdAndDelete(recipeId)
        console.log(recipeToBeDelete)
    } catch (error) {
        throw error;
    }
}

app.delete("/recipes/:id", async (req, res) => {
    try {
        const deletedRecipe = await deleteRecipe(req.params.id)
        res.status(200).json({message: "Recipe deleted successfully."})
    } catch (error) {
        res.status(500).json({error: "Recipe not found."})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`)
})