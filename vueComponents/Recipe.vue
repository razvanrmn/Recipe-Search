<template>
  <div>
    <h2>Recipe Search</h2>
    <div>
      <label for="ingredients">Select Ingredients:</label>
      <input
          type="text"
          id="ingredients"
          v-model="ingredientSearchQuery"
          placeholder="Enter ingredients separated by commas"
      />
      <button @click="searchByIngredients">Search</button>
    </div>
    <div v-if="ingredientLoading">Loading...</div>
    <div v-if="filteredIngredients.length > 0">
      <h3>Matching Ingredients:</h3>
      <ul>
        <li v-for="ingredient in filteredIngredients" :key="ingredient.id">
          {{ ingredient.name }}
          <button @click="showIngredientRecipes(ingredient)">Show Recipes</button>
        </li>
      </ul>
    </div>
    <div v-if="recipes.length > 0">
      <h3>Matching Recipes:</h3>
      <ul>
        <li v-for="recipe in recipes" :key="recipe.id">
          <a @click="showRecipeDetails(recipe)">{{ recipe.title }}</a>
        </li>
      </ul>
    </div>
    <div v-if="selectedRecipe">
      <h3>Recipe Details:</h3>
      <div>
        <h4>{{ selectedRecipe.title }}</h4>
        <p v-html="selectedRecipe.instructions"></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_KEY = 'c355f7b1bcc04ee880d3162730a17ac8';

export default {
  data() {
    return {
      ingredientSearchQuery: '',
      ingredients: [],
      ingredientLoading: false,
      recipes: [],
      selectedRecipe: null,
    };
  },
  computed: {
    filteredIngredients() {
      return this.ingredients.filter((ingredient) =>
          ingredient.name.toLowerCase().includes(this.ingredientSearchQuery.toLowerCase())
      );
    },
  },
  methods: {
    searchByIngredients() {
      this.ingredientLoading = true;

      const ingredients = this.ingredientSearchQuery.split(',').map((ingredient) => ingredient.trim());

      axios
          .get(`https://api.spoonacular.com/recipes/findByIngredients`, {
            params: {
              apiKey: API_KEY,
              ingredients: ingredients.join(','),
              number: 10,
            },
          })
          .then((response) => {
            this.recipes = response.data;
            this.selectedRecipe = null; // Reset selected recipe when searching for new recipes
          })
          .catch((error) => {
            console.error('Error fetching recipes:', error);
          })
          .finally(() => {
            this.ingredientLoading = false;
          });
    },
    showIngredientRecipes(ingredient) {
      this.ingredientLoading = true;

      axios
          .get(`https://api.spoonacular.com/recipes/findByIngredients`, {
            params: {
              apiKey: API_KEY,
              ingredients: ingredient.name,
              number: 10,
            },
          })
          .then((response) => {
            this.recipes = response.data;
            this.selectedRecipe = null; // Reset selected recipe when showing ingredient recipes
          })
          .catch((error) => {
            console.error('Error fetching recipes:', error);
          })
          .finally(() => {
            this.ingredientLoading = false;
          });
    },
    showRecipeDetails(recipe) {
      this.ingredientLoading = true;

      axios
          .get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
            params: {
              apiKey: API_KEY,
            },
          })
          .then((response) => {
            this.selectedRecipe = response.data;
          })
          .catch((error) => {
            console.error('Error fetching recipe details:', error);
          })
          .finally(() => {
            this.ingredientLoading = false;
          });
    },
  },
};
</script>
