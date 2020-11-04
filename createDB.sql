1. Create Database
CREATE DATABASE food_website;

2. Creat 3 tables (cuisines, diets, types)
CREATE TABLE cuisines(
    cuisine_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE diets(
    diet_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE types(
    type_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);


3. Create Table Recipes
CREATE TABLE recipes(
    id serial PRIMARY KEY,
    recipe_id int NOT NULL UNIQUE,
    user_id int,
    recipe_name varchar(255),
    recipe_instruction varchar(8000),
    recipe_image varchar(255),
    vegetarian BOOLEAN,
    vegan BOOLEAN,
    glutenFree BOOLEAN,
    dairyFree BOOLEAN,
    veryHealthy BOOLEAN,
    cheap BOOLEAN,
    veryPopular BOOLEAN,
    sustainable BOOLEAN,
    ingredients JSON NOT NULL,
    equipment JSON NOT NULL,
    nutrient JSON NOT NULL
);

4. Create 3 tables for recipe_cuisine, recipe_diet, recipe_type
CREATE TABLE recipe_cuisine(
  id SERIAL PRIMARY KEY,
  recipe_id int NOT NULL,
  cuisine_id int NOT NULL  
);

CREATE TABLE recipe_diet(
  id SERIAL PRIMARY KEY,
  recipe_id int NOT NULL,
  diet_id int NOT NULL  
);

CREATE TABLE recipe_type(
  id SERIAL PRIMARY KEY,
  recipe_id int NOT NULL,
  type_id int NOT NULL  
);
