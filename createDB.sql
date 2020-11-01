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
    user_id int NOT NULL UNIQUE,
    recipe_name varchar(255),
    recipe_instruction varchar(255),
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

4. Insert all querys of cuisines, diets, types into each table
INSERT INTO cuisines (name) VALUES ('African');
INSERT INTO cuisines (name) VALUES ('American');
INSERT INTO cuisines (name) VALUES ('British');
INSERT INTO cuisines (name) VALUES ('Cajun');
INSERT INTO cuisines (name) VALUES ('Caribbean');
INSERT INTO cuisines (name) VALUES ('Chinese');
INSERT INTO cuisines (name) VALUES ('Eastern European');
INSERT INTO cuisines (name) VALUES ('European');
INSERT INTO cuisines (name) VALUES ('French');
INSERT INTO cuisines (name) VALUES ('German');
INSERT INTO cuisines (name) VALUES ('Indian');
INSERT INTO cuisines (name) VALUES ('Irish');
INSERT INTO cuisines (name) VALUES ('Italian');
INSERT INTO cuisines (name) VALUES ('Japanese');
INSERT INTO cuisines (name) VALUES ('Jewish');
INSERT INTO cuisines (name) VALUES ('Korean');
INSERT INTO cuisines (name) VALUES ('Latin American');
INSERT INTO cuisines (name) VALUES ('Mediterranean');
INSERT INTO cuisines (name) VALUES ('Mexican');
INSERT INTO cuisines (name) VALUES ('Nordic');
INSERT INTO cuisines (name) VALUES ('Southern');
INSERT INTO cuisines (name) VALUES ('Spanish');
INSERT INTO cuisines (name) VALUES ('Thai');
INSERT INTO cuisines (name) VALUES ('Vietnamese');

INSERT INTO diets (name) VALUES ('Gluten Free');
INSERT INTO diets (name) VALUES ('Ketogenic');
INSERT INTO diets (name) VALUES ('Vegetarian');
INSERT INTO diets (name) VALUES ('Lacto-Vegetarian');
INSERT INTO diets (name) VALUES ('Ovo-Vegetarian');
INSERT INTO diets (name) VALUES ('Vegan');
INSERT INTO diets (name) VALUES ('Pescetarian');
INSERT INTO diets (name) VALUES ('Paleo');
INSERT INTO diets (name) VALUES ('Primal');
INSERT INTO diets (name) VALUES ('Whole30');

INSERT INTO types (name) VALUES ('main course');
INSERT INTO types (name) VALUES ('side dish');
INSERT INTO types (name) VALUES ('dessert');
INSERT INTO types (name) VALUES ('appetizer');
INSERT INTO types (name) VALUES ('salad');
INSERT INTO types (name) VALUES ('bread');
INSERT INTO types (name) VALUES ('breakfast');
INSERT INTO types (name) VALUES ('soup');
INSERT INTO types (name) VALUES ('beverage');
INSERT INTO types (name) VALUES ('sauce');
INSERT INTO types (name) VALUES ('marinade');
INSERT INTO types (name) VALUES ('fingerfood');
INSERT INTO types (name) VALUES ('snack');
INSERT INTO types (name) VALUES ('drink');
