
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('diets').del()
    .then(function () {
      // Inserts seed entries
      return knex('diets').insert([
        {diet_id: 1, name: 'Gluten Free'},
        {diet_id: 2, name: 'Ketogenic'},
        {diet_id: 3, name: 'Vegetarian'},
        {diet_id: 4, name: 'Lacto-Vegetarian'},
        {diet_id: 5, name: 'Ovo-Vegetarian'},
        {diet_id: 6, name: 'Vegan'},
        {diet_id: 7, name: 'Pescetarian'},
        {diet_id: 8, name: 'Paleo'},
        {diet_id: 9, name: 'Primal'},
        {diet_id: 10, name: 'Whole30'},
      ]);
    });
};
