
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cuisines').del()
    .then(function () {
      // Inserts seed entries
      return knex('cuisines').insert([
        {cuisine_id: 1, name: 'African'},
        {cuisine_id: 2, name: 'American'},
        {cuisine_id: 3, name: 'British'},
        {cuisine_id: 4, name: 'Cajun'},
        {cuisine_id: 5, name: 'Caribbean'},
        {cuisine_id: 6, name: 'Chinese'},
        {cuisine_id: 7, name: 'Eastern European'},
        {cuisine_id: 8, name: 'European'},
        {cuisine_id: 9, name: 'French'},
        {cuisine_id: 10, name: 'German'},
        {cuisine_id: 11, name: 'Indian'},
        {cuisine_id: 12, name: 'Irish'},
        {cuisine_id: 13, name: 'Italian'},
        {cuisine_id: 14, name: 'Japanese'},
        {cuisine_id: 15, name: 'Jewish'},
        {cuisine_id: 16, name: 'Korean'},
        {cuisine_id: 17, name: 'Latin American'},
        {cuisine_id: 18, name: 'Mediterranean'},
        {cuisine_id: 19, name: 'Mexican'},
        {cuisine_id: 20, name: 'Nordic'},
        {cuisine_id: 21, name: 'Southern'},
        {cuisine_id: 22, name: 'Spanish'},
        {cuisine_id: 23, name: 'Thai'},
        {cuisine_id: 24, name: 'Vietnamese'},
      ]);
    });
};
