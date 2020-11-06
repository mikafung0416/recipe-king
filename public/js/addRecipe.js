// photo preview
function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $('#user-photo').attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }
  
  $("#recipe-img").change(function() {
    readURL(this);
    $("#user-photo").css('display', 'block');
  });

// more button for ingredients
let i = 1;
$('#more-ingredient').click(() => {
  $(`#ingredient-box-${i}`).append(`<span id="ingredient-box-${i+1}"><input type="text" name="ingredient-${i+1}" class="add-text" id="ingredient-${i+1}"></span>`);
  i++;
})

// more button for equipment
let j = 1;
$('#more-equipment').click(() => {
  $(`#equipment-box-${j}`).append(`<span id="equipment-box-${j+1}"><input type="text" name="equipment-${i+1}" class="add-text" id="equipment-${j+1}"></span>`);
  j++;
})

// more button for instructions
let k = 1;
$('#more-instruction').click(() => {
  $(`#instruction-box-${k}`).append(`<span id="instruction-box-${k+1}"><input type="text" name="instruction-${k+1}" class="add-text" id="instruction-${k+1}"></span>`);
  j++;
})