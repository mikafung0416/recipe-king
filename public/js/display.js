const recipesDOM = document.getElementById("rightContentContent"); //get the recipes DOM
const footerDOM = document.querySelector(".footer-container"); //get the footer DOM

const getRecipesHeight = () => {
  let addedHeight = recipesDOM.offsetHeight + 200;
  if (addedHeight < 1500) {
    addedHeight = 2500; //should be minimum height for footer to stay at bottom
  } else {
    addedHeight = recipesDOM.offsetHeight + 400;
  }
  footerDOM.style.position = "absolute";
  footerDOM.style.top = addedHeight + "px";
};

//For zooming to 25%, the footer should be at least top = 3500px;
//For footer to stick at the bottom after rendering recipes
getRecipesHeight();

const toggleBroadQuery = (e) => {
  const queryDOM = document.querySelectorAll(".queryTag");
  const spanID = e.id; //get the id of clicked span
  const arrowDOM = document.querySelector(`#${spanID} i`); //get the arrow DOM under the span
  // console.log(arrowDOM);
  // console.log(queryDOM);
  if (queryDOM.length > 10) {
    if (arrowDOM.className === "fas fa-angle-up") {
      // console.log(arrowDOM.className);
      for (let i = 10; i < queryDOM.length; i++) {
        queryDOM[i].style.display = "none";
        arrowDOM.className = "fas fa-angle-down"; //change the up arraow to down arrow
      }
    } else {
      for (let i = 0; i < queryDOM.length; i++) {
        queryDOM[i].style.display = "block";
        arrowDOM.className = "fas fa-angle-up";
      }
    }
  }
};

const toggleFilterQuery = (e) => {
  const spanID = e.id;
  const broadQueryTag = document.querySelectorAll(`.${spanID}-query`);
  const arrowDOM = document.querySelector(`#${spanID} i`);
  console.log(broadQueryTag);
  if (broadQueryTag.length > 10) {
    if (arrowDOM.className === "fas fa-angle-up") {
      // console.log(arrowDOM.className);
      for (let i = 10; i < broadQueryTag.length; i++) {
        broadQueryTag[i].style.display = "none";
        arrowDOM.className = "fas fa-angle-down"; //change the up arraow to down arrow
      }
    } else {
      for (let i = 0; i < broadQueryTag.length; i++) {
        broadQueryTag[i].style.display = "block";
        arrowDOM.className = "fas fa-angle-up";
      }
    }
  } else {
    arrowDOM.style.display = "none";
  }
};
