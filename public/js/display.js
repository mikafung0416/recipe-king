const recipesDOM = document.getElementById("rightContentContent"); //get the recipes DOM
const footerDOM = document.querySelector(".footer-container"); //get the footer DOM

const getRecipesHeight = () => {
  let addedHeight = recipesDOM.offsetHeight + 200;
  if (addedHeight < 1500) {
    addedHeight = 1500; //should be minimum height for footer to stay at bottom
  } else {
    addedHeight = recipesDOM.offsetHeight + 200;
  }
  alert(recipesDOM.offsetHeight);
  footerDOM.style.position = "absolute";
  footerDOM.style.top = addedHeight + "px";
};


//For zooming to 25%, the footer should be at least top = 3500px;


getRecipesHeight();
