const recipesDOM = document.getElementById("rightContentContent"); //get the recipes DOM
const footerDOM = document.querySelector(".footer-container"); //get the footer DOM

const getRecipesHeight = () => {
  const addedHeight = recipesDOM.offsetHeight + 500;
  console.log(recipesDOM.offsetHeight);
  footerDOM.style.position = "absolute";
  footerDOM.style.top = addedHeight + "px";
};

getRecipesHeight();
