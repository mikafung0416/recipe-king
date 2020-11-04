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
// more button