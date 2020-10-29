const recipesDOM = document.getElementById("rightContentContent"); //get the recipes DOM
const footerDOM = document.querySelector(".footer-container"); //get the footer DOM

const getRecipesHeight = () => {
  let addedHeight = recipesDOM.offsetHeight + 200;
  if (addedHeight < 1500) {
    addedHeight = 1500; //should be minimum height for footer to stay at bottom
  } else {
    addedHeight = recipesDOM.offsetHeight + 400;
  }
  footerDOM.style.position = "absolute";
  footerDOM.style.top = addedHeight + "px";
};

//For zooming to 25%, the footer should be at least top = 3500px;
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
  //need toggle the arrow button
};
