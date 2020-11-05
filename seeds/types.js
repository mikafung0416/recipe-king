
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('types').del()
    .then(function () {
      // Inserts seed entries
      return knex('types').insert([
        {type_id: 1, name: 'main course'},
        {type_id: 2, name: 'side dish'},
        {type_id: 3, name: 'dessert'},
        {type_id: 4, name: 'appetizer'},
        {type_id: 5, name: 'salad'},
        {type_id: 6, name: 'bread'},
        {type_id: 7, name: 'breakfast'},
        {type_id: 8, name: 'soup'},
        {type_id: 9, name: 'beverage'},
        {type_id: 10, name: 'sauce'},
        {type_id: 11, name: 'marinade'},
        {type_id: 12, name: 'fingerfood'},
        {type_id: 13, name: 'snack'},
        {type_id: 14, name: 'drink'},
      ]);
    });
};
