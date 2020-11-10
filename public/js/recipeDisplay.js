//onReady function
$(document).ready(function () {
  let recipeID = $("#recipeID").val();
  let userID = $("#userID").val();
  let fav = { recipeID: recipeID, user_id: userID };
  // console.log(recipeID)

  $.post("/comments/existing", { recipeID: recipeID }, function (data) {
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
      onloadInsert(data[i]);
    }
  });

  $.post("/recipes/:id/favourited/existing", { recipeID: recipeID }, function(data){
    // console.log(data)
    count(data);
  })

  $("#commentPostBtn").click(function () {
    let text = $("#commentPostText").val();
    let textSpaced = text.replaceAll("\n", "<br>");
    // console.log(textSpaced)

    let userID = $("#userID").val();
    let username = $("#username").val();
    let fd = {
      userID: userID,
      recipeID: recipeID,
      username: username,
      text: textSpaced,
    };

    if (text.length > 0 && userID != null) {
      //return no border
      $("#commentPostText").css("border", "none");
      //ajax post
      $.ajax({
        url: "/comments",
        method: "POST",
        data: fd,

        success: (data) => {
          // console.log(data);
          commentInsert(data);
        },
      });
    } else {
      //make red border if no text
      $("#commentPostText").css("border", "1px solid red");
    }
    //to empty the textbox once post happens
    $("#commentPostText").val("");
  });

  $("#favBtn").on("click", (event) => {
    event.preventDefault();
    // console.log('fav button clicked')
    
    $.ajax({
      url: "/recipes/:id/favourited",
      method: "POST",
      data: fav,

      success: (data) => {
        console.log(data);
        count(data);
      },
    });
  });

  function count(data) {
    let count = 0;
    while (count < data.length) {
      count++
    }
    console.log(count)
    $(".liked-p").text(count + " people have added this recipe to favourites");
    
  }

  function commentInsert(data) {
    var t = "";
    t += '<li class="commentsLi" id="commentsPlace">';
    t += '<div class="usernameField">';
    t += ` ${data.username}`;
    t += ` ${data.time}`;
    t += "</div>";
    t += '<div class="commentText">';
    t += `${data.comment}`;
    t += "</div>";
    // t+='<div class="commentsButtonsHolder">';
    // t+=' <ul>';
    // t+=' <li class="deleteBtn">X</li>';
    // t+=' </ul>';
    // t+='</div>';
    t += "</li>";
    $(".commentsUl").prepend(t);
  }

  function onloadInsert(data) {
    var v = "";
    v += '<li class="commentsLi" id="commentsPlace">';
    v += '<div class="usernameField">';
    v += ` ${data.username}`;
    v += ` ${data.time}`;
    v += "</div>";
    v += '<div class="commentText">';
    v += `${data.comment}`;
    v += "</div>";
    // v+='<div class="commentsButtonsHolder">';
    // v+=' <ul>';
    // v+=' <li class="deleteBtn">X</li>';
    // v+=' </ul>';
    // v+='</div>';
    v += "</li>";
    $(".commentsUl").append(v);
  }
});
