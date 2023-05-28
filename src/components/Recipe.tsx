import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Ingredient {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  instructions: string;
}

const API_KEY = 'c355f7b1bcc04ee880d3162730a17ac8';

const RecipeSearch = () => {
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientLoading, setIngredientLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(ingredientSearchQuery.toLowerCase().trim())
  );

  const searchByIngredients = () => {
    // Clear previous error messages
    setErrorMessage('');

    const query = ingredientSearchQuery.trim();
    if (query === '') {
      setErrorMessage('Please enter at least one ingredient.');
      return;
    }

    const ingredients = query.split(',').map((ingredient) => ingredient.trim());

    if (ingredients.some((ingredient) => ingredient.length < 2)) {
      setErrorMessage('Each ingredient should have a minimum length of 2 characters.');
      return;
    }

    setIngredientLoading(true);

    axios
      .get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
          apiKey: API_KEY,
          ingredients: ingredients.join(','),
        },
      })
      .then((response) => {
        setRecipes(response.data);
        setSelectedRecipe(null);
        if (response.data.length === 0) {
          setErrorMessage('No recipes found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
        setErrorMessage('Error fetching recipes. Please try again.');
      })
      .finally(() => {
        setIngredientLoading(false);
      });
  };

  const showIngredientRecipes = (ingredient: Ingredient) => {
    setIngredientLoading(true);

    axios
      .get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
          apiKey: API_KEY,
          ingredients: ingredient.name,
          number: 10,
        },
      })
      .then((response) => {
        setRecipes(response.data);
        setSelectedRecipe(null);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      })
      .finally(() => {
        setIngredientLoading(false);
      });
  };

  const showRecipeDetails = (recipe: Recipe) => {
    setIngredientLoading(true);

    axios
      .get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: API_KEY,
        },
      })
      .then((response) => {
        setSelectedRecipe(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipe details:', error);
      })
      .finally(() => {
        setIngredientLoading(false);
      });
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
    <div className="flex flex-col items-center justify-between overflow-hidden rounded-md bg-white shadow-md">
      <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">{recipe.title}</h2>
        <button
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
          onClick={() => showRecipeDetails(recipe)}
        >
          View Details
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    axios
      .get('https://api.spoonacular.com/food/ingredients/autocomplete', {
        params: {
          apiKey: API_KEY,
          number: 10,
        },
      })
      .then((response) => {
        setIngredients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching ingredients:', error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Search</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter ingredients (comma-separated)"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={ingredientSearchQuery}
          onChange={(e) => setIngredientSearchQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md ml-4 shadow hover:bg-blue-600"
          onClick={searchByIngredients}
          disabled={ingredientLoading}
        >
          {ingredientLoading ? 'Loading...' : 'Search'}
        </button>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="p-4 border border-gray-300 rounded-md bg-white shadow-md cursor-pointer"
            onClick={() => showIngredientRecipes(ingredient)}
          >
            {ingredient.name}
          </div>
        ))}
      </div>
      <div className="mt-8">
        {recipes.length > 0 && (
          <h2 className="text-xl font-bold mb-4">Recipes ({recipes.length})</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      {selectedRecipe && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="max-w-lg w-full bg-white rounded-md p-8">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
            <h2 className="text-xl font-bold mb-4">{selectedRecipe.title}</h2>
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              className="w-full h-48 object-cover mb-4"
            />
            <p>{selectedRecipe.summary}</p>
            <h3 className="text-lg font-bold mt-4">Instructions:</h3>
            <div
              dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
              className="mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
