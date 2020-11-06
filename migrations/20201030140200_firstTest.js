exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments().primary();
      table.string("username").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.integer("user_diet"); // not using foreign key here as no need to join this table and recipe_diet table
      table.integer("fav_cuisine");
      table.timestamps();
    })
    .createTable("cuisines", (table) => {
      table.increments("cuisine_id").primary();
      table.string("name");
    })
    .createTable("diets", (table) => {
      table.increments("diet_id").primary();
      table.string("name");
    })
    .createTable("types", (table) => {
      table.increments("type_id").primary();
      table.string("name");
    })
    .createTable("recipes", (table) => {
      table.increments().primary();
      table.integer("recipe_id").notNullable();
      table.integer("user_id");
      table.foreign("user_id").references("users.id");
      table.string("recipe_name").notNullable();
      table.string("recipe_instruction", 8000);
      table.string("recipe_image");
      table.integer("recipe_cooking_time");
      table.integer("servings");
      table.json("cuisines");
      table.json("dishTypes");
      table.json("diets");
      table.boolean("vegetarian");
      table.boolean("vegan");
      table.boolean("glutenFree");
      table.boolean("dairyFree");
      table.boolean("veryHealthy");
      table.boolean("cheap");
      table.boolean("veryPopular");
      table.boolean("sustainable");
      table.json("ingredients");
      table.json("equipment");
      table.json("nutrient");
    })
    .createTable("comment", (table) => {
      table.increments().primary();
      table.integer("recipe_id").notNullable();
      // table.foreign('recipe_id').references('recipes.id');
      table.integer("user_id").notNullable();
      // table.foreign('user_id').references('users.id');
      table.string("comment", 8000).notNullable();
    })
    .createTable("recipe_cuisine", (table) => {
      table.increments().primary();
      table.integer("recipe_id").notNullable();
      // table.foreign('recipe_id').references('recipes.id');
      table.integer("cuisine_id").notNullable();
      // table.foreign('cuisine_id').references('cuisines.cuisine_id');
    })
    .createTable("recipe_diet", (table) => {
      table.increments().primary();
      table.integer("recipe_id").notNullable();
      // table.foreign('recipe_id').references('recipes.id');
      table.integer("diet_id").notNullable();
      // table.foreign('diet_id').references('diets.diet_id');
    })
    .createTable("recipe_type", (table) => {
      table.increments().primary();
      table.integer("recipe_id").notNullable();
      // table.foreign('recipe_id').references('recipes.id');
      table.integer("type_id").notNullable();
      // table.foreign('type_id').references('types.type_id');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable("recipe_type")
    .dropTable("recipe_diet")
    .dropTable("recipe_cuisine")
    .dropTable("comment")
    .dropTable("recipes")
    .dropTable("types")
    .dropTable("diets")
    .dropTable("cuisines")
    .dropTable("users");
};
