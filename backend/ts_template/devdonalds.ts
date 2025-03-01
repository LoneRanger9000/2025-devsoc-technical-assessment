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
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
