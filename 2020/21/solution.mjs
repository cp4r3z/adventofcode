/**
 * https://adventofcode.com/2020/day/21
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

class Food {
    constructor(name) {
        this.Name = name; // use line number. "food0", "food1" etc
        this.Ingredients = new Set(); // ingredients in food
        this.Allergens = new Set();
    }
}

class Ingredient {
    constructor(name) {
        this.Name = name;
        this.Foods = new Set(); // foods that the ingredient is found in
        this.Appears = 0;
        this.PossibleAllergens = new Set();
    }
}

class Allergen {
    constructor(name) {
        this.Name = name;
        this.Foods = new Set();
    }
}

const foods = new Map();
const ingredients = new Map();
const allergens = new Map();

arrInput.forEach((foodStr, i) => {
    const foodName = `food${i}`;
    const food = new Food(foodName);

    // now create ingredients and allergens
    const findAllergens = foodStr.match(/ \(contains(.+)\)/);
    const foodAllergens = findAllergens[1].split(',').map(str => str.trim());

    const allergensInFood = []; // Used later
    foodAllergens.forEach(allergenName => {
        let allergen = allergens.get(allergenName) || new Allergen(allergenName);
        allergen.Foods.add(food);
        allergensInFood.push(allergen);
        allergens.set(allergenName, allergen);
        food.Allergens.add(allergen);
    });

    const foodIngredients = foodStr.substring(0, findAllergens.index).split(' ').map(str => str.trim());

    foodIngredients.forEach(ingredientName => {
        let ingredient = ingredients.get(ingredientName) || new Ingredient(ingredientName);
        ingredient.Foods.add(food);
        ingredient.Appears++; // Count the number of times the ingredient appears

        // Transfer the allergens in this food to the ingredient as a possible allergen
        allergensInFood.forEach(pAllergen => {
            ingredient.PossibleAllergens.add(pAllergen);
        });

        ingredients.set(ingredientName, ingredient);
        food.Ingredients.add(ingredient);
    });

    foods.set(foodName, food);
});

/**
 * for each ingredient, eliminate possible allergens
 * for each possible allergen, get the list of foods. 
 * the ingredient must be found in every one of those foods. 
 * else delete it from the list
 */

ingredients.forEach(ingredient => {
    ingredient.PossibleAllergens.forEach(possibleAllergen => {
        const valid = [...possibleAllergen.Foods].every(food => food.Ingredients.has(ingredient));
        if (!valid) ingredient.PossibleAllergens.delete(possibleAllergen);
    });
});

const part1 = [...ingredients].reduce((acc, [key, ingredient]) => {
    return (ingredient.PossibleAllergens.size === 0) ? acc + ingredient.Appears : acc;
}, 0);

console.log(`Year 2020 Day 21 Part 1 Solution: ${part1}`);

// filter the ingredients list of all non-dangerous ingredients
const dangerousIngredients = new Map();
ingredients.forEach((ingredient, key) => {
    if (ingredient.PossibleAllergens.size > 0) dangerousIngredients.set(key, ingredient);
});

// Build the canonical list 
const canonical = new Set();

while (dangerousIngredients.size !== canonical.size) {
    dangerousIngredients.forEach(ingredient => {
        if (ingredient.PossibleAllergens.size === 1) {
            if (canonical.has(ingredient)) return;

            // "Each allergen is found in exactly one ingredient."
            // Remove this allergen from all _other_ ingredients
            const knownAllergen = ingredient.PossibleAllergens.values().next().value;
            ingredients.forEach(oIngredient => {
                if (ingredient.Name === oIngredient.Name) return;
                oIngredient.PossibleAllergens.delete(knownAllergen);
            });
            canonical.add(ingredient);
        }
    });
}

const part2 = [...canonical]
    .sort((ingredientA, ingredientB) => {
        const allergenA = ingredientA.PossibleAllergens.values().next().value;
        const allergenB = ingredientB.PossibleAllergens.values().next().value;
        return (allergenA.Name < allergenB.Name) ? -1 : 1;
    })
    .map(ingredient => ingredient.Name)
    .join(',');

console.log(`Year 2020 Day 21 Part 2 Solution: ${part2}`);