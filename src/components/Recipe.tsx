import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_KEY = '221c8f1bda144e7394203f9a36ad9766'

const RecipeSearch = () => {
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [ingredientLoading, setIngredientLoading] = useState(false)
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name
      .toLowerCase()
      .includes(ingredientSearchQuery.toLowerCase().trim())
  )

  const searchByIngredients = () => {
    // Clear previous error messages
    setErrorMessage('')

    const query = ingredientSearchQuery.trim()
    if (query === '') {
      setErrorMessage('Please enter at least one ingredient.')
      return
    }

    const ingredients = query.split(',').map((ingredient) => ingredient.trim())

    if (ingredients.some((ingredient) => ingredient.length < 2)) {
      setErrorMessage(
        'Each ingredient should have a minimum length of 2 characters.'
      )
      return
    }

    setIngredientLoading(true)

    axios
      .get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
          apiKey: API_KEY,
          ingredients: ingredients.join(',')
        }
      })
      .then((response) => {
        setRecipes(response.data)
        setSelectedRecipe(null)
        if (response.data.length === 0) {
          setErrorMessage('No recipes found.')
        }
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error)
        setErrorMessage('Error fetching recipes. Please try again.')
      })
      .finally(() => {
        setIngredientLoading(false)
      })
  }

  const showIngredientRecipes = (ingredient) => {
    setIngredientLoading(true)

    axios
      .get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
          apiKey: API_KEY,
          ingredients: ingredient.name,
          number: 10
        }
      })
      .then((response) => {
        setRecipes(response.data)
        setSelectedRecipe(null)
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error)
      })
      .finally(() => {
        setIngredientLoading(false)
      })
  }

  const showRecipeDetails = (recipe) => {
    setIngredientLoading(true)

    axios
      .get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: API_KEY
        }
      })
      .then((response) => {
        setSelectedRecipe(response.data)
      })
      .catch((error) => {
        console.error('Error fetching recipe details:', error)
      })
      .finally(() => {
        setIngredientLoading(false)
      })
  }

  const closeRecipeDetails = () => {
    setSelectedRecipe(null)
  }
  const RecipeCard = ({ recipe }) => (
    <div className="flex flex-col items-center justify-between overflow-hidden rounded-md bg-white shadow-md">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="h-40 w-full object-cover"
      />
      <div className="flex grow flex-col items-center justify-between p-4">
        <h3 className="mb-2 text-lg font-semibold">{recipe.title}</h3>
        <p className="text-gray-800">{recipe.summary}</p>
        <div className="mt-4 flex justify-center">
          <button
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white focus:outline-none"
            onClick={(e) => {
              e.stopPropagation()
              showRecipeDetails(recipe)
            }}
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  )

  const RecipeDetails = ({ recipe }) => {
    return (
      <div className="mt-4 flex flex-col items-center">
        <div className="mb-2 flex w-full max-w-lg items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Recipe Details:
          </h3>
          <button
            className="text-red-500 hover:text-red-700 focus:text-red-700 focus:outline-none"
            onClick={closeRecipeDetails}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="ml-4 w-full max-w-lg text-left">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800">
            {recipe.title}
          </h4>
          <p
            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
            className="whitespace-pre-line"
          ></p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-blue-500">
      <div
        className="flex flex-1 flex-col items-center justify-center bg-blue-500 py-16 text-center text-white"
        style={{
          backgroundImage:
            "url('https://www.vangoghmuseum.nl/en/collection/s0032V1962?v=1')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h2 className="mb-4 text-4xl font-semibold">Recipe Search</h2>
        <p className="mb-8 text-lg">
          Search by ingredients or explore trending recipes.
        </p>
        <div className="flex flex-col items-center">
          <input
            type="text"
            id="ingredients"
            value={ingredientSearchQuery}
            onChange={(event) => setIngredientSearchQuery(event.target.value)}
            placeholder="Enter ingredients separated by commas"
            className="mb-4 w-11/12 rounded-md border border-gray-300 px-4 py-2 text-base text-black focus:border-blue-500 focus:outline-none md:w-96"
          />
          <button
            onClick={searchByIngredients}
            className="inline-block w-11/12 rounded-md bg-white px-6 py-3 text-base font-medium text-blue-500 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none md:w-auto"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-6 shadow-md">
        {ingredientLoading && (
          <div className="italic text-gray-800">Loading...</div>
        )}
        {filteredIngredients.length > 0 && (
          <div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              Matching Ingredients:
            </h3>
            <ul className="mb-4">
              {filteredIngredients.map((ingredient) => (
                <li key={ingredient.id} className="mb-2">
                  {ingredient.name}
                  <button
                    onClick={() => showIngredientRecipes(ingredient)}
                    className="ml-2 inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white focus:bg-blue-600 focus:outline-none"
                  >
                    Show Recipes
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {recipes.length > 0 && (
          <div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              Recipes:
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-500">{errorMessage}</div>
        )}
      </div>
      {selectedRecipe && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="rounded-lg bg-white p-6">
            <RecipeDetails recipe={selectedRecipe} />
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeSearch
