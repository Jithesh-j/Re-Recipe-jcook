#!/bin/bash

echo "Running selected Mocha tests..."
# Navigate to the script's directory
cd "$(dirname "$0")"

# Run the specified Mocha test files with the spec reporter
npx mocha --reporter spec getRecipeListObjects.test.js getSingleRecipe.test.js