import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: (recipe | ingredient)[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  recipeName = recipeName.toLowerCase()               // Converting all upercase to lowercase
    .trim()                                           // Removing all trailing white spaces
    .replace(/[-_]/g, " ")                            // Converting all hyphens to a whitespace
    .replace(/[^a-z ]/g, "")                          // Remvoing all non letter non space-bar characters
    .replace(/ +/g, " ")                              // If a space appears more than once, replace it with one space
    .replace(/\b\w/g, (char) => char.toUpperCase());  // Uppercasing the first letter of all words

  if (recipeName.length === 0) {
    return null;
  } else {
    return recipeName;
  }
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const input = req.body;

  const type = input.type;
  const name = input.name;

  if (type !== "recipe" && type !== "ingredient")
    return res.status(400).json({ error: "type can only be \"recipe\" or \"ingredient\""});

  // Returning error if entry name was seen before
  for (let i = 0; i < cookbook.length; i++) {
    if (cookbook[i].name === name)
      return res.status(400).json({ error: "entry names must be unique"});
  }

  // Returning error if recipe has negative cook time
  switch(type) {
    case "recipe":
      for (let requiredItem of input.requiredItems)
        if (requiredItem.cookTime < 0)
          return res.status(400).json({ error: "cookTime can only be greater than or equal to 0"});
      break;
    case "ingredient":
      if (input.cookTime < 0)
        return res.status(400).json({ error: "cookTime can only be greater than or equal to 0"});
      break;
    default:
  }

  // Storing the new recipe/ingredient and sending a successful code
  cookbook.push(input);
  res.status(200).json({});
});

// [TASK 3] ====================================================================
// Helper function that allows us recurse into further ingredients
const push_required_ingredients_to_stack = (recipeObject: recipe, numRecipe: number, stack: {name: string, quantity: number}[]) => {
  for (let requiredItem of recipeObject.requiredItems) {
    stack.push({name: requiredItem.name, quantity: requiredItem.quantity * numRecipe});
  }
}

// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  // Reading in the name of the recipe
  const { name } = req.query;

  // Finding the entry in the cookbook
  const targetEntry = cookbook.find(dish => dish.name === name);

  // Error if not found or of the wrong type
  if (!targetEntry || targetEntry.type != "recipe") {
    res.status(400).send("Can't find or is not a recipe");
  }

  // stack and map will help us in compiling the list of all ingredients required
  const ingredientsMap: Map<string, number> = new Map();
  const stack: {name: string, quantity: number}[] = [];
  push_required_ingredients_to_stack(targetEntry as recipe, 1, stack);

  while (stack.length !== 0) {
    const top = stack.pop();
    const curName = top.name;
    const quantity = top.quantity;
    const curEntry = cookbook.find(entry => entry.name === curName);

    // If required ingredient not found, then return error
    if (!curEntry)
      res.status(400).send("Can't find a requiredIngredient");

    // if it is an ingredient, add it to the map
    // if it is a recipe, continue recursing
    if (curEntry.type === "ingredient") {
      if (ingredientsMap.has(curName)) {
        ingredientsMap.set(curName, ingredientsMap.get(curName) + quantity);
      } else {
        ingredientsMap.set(curName, quantity);
      }
    } else {
      push_required_ingredients_to_stack(curEntry as recipe, quantity, stack);
    }
  }

  // Compiling a summary
  const summary: {name: string; cookTime: number; ingredients: {name: string; quantity: number}[]} = {
    name: name,
    cookTime: 0,
    ingredients: []
  };

  // Traversing the map, and adding each ingredient
  ingredientsMap.forEach((value, key) => {
    summary.ingredients.push({name: key, quantity: value});
    summary.cookTime += value * (cookbook.find(ingredient => ingredient.name == key) as ingredient).cookTime;
  });

  res.status(200).json(summary);
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
