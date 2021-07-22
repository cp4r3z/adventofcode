/**
 * https://adventofcode.com/2020/day/21
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

class Food {
    constructor(name) {
        this.Name = name; // use line number? "food0", "food1" etc
    }
}

class Ingredient {
    constructor(name) {
        this.Name = name;
    }
}

class Allergen {
    constructor(name) {
        this.Name = name;
    }
}

const foods = new Map();
const Ingredients = new Map();
const allergens = new Map();

arrInput.forEach((food, i) => {
    const foodName = `food${i}`;
    foods.set(foodName, new Food(foodName));

    // now create ingredients and allergens
    const findAllergens = food.match(/ \(contains(.+)\)/);
    const foodAllergens = findAllergens[1].split(',').map(str => str.trim());
    const foodIngredients = food.substring(0, findAllergens.index).split(' ').map(str => str.trim());
    console.log(' ');

});

console.log(`Year 2020 Day 21 Part 1 Solution: ${part1}`);