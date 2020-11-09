//onReady function
$(document).ready(function(){
    let recipeID = $('#recipeID').val()
    // console.log(recipeID)

    $.post('/comments/existing', 
    {"recipeID" : recipeID}, 
    function(data){
        console.log(data)
        $("#commentsIn").append(
            data.map((username,comment)=>
           `<div class="commentAppended">
           <ul class="commentsUl">
             <li class="commentsLi" id="commentsPlace">
               <div class="usernameField">
                 ${username}
               </div>
               <div class="commentText">
               ${comment}
               </div>
               <div class="commentsButtonsHolder">
                 <ul>
                 <li class="deleteBtn">X</li>
                 </ul>
               </div>
             </li>
           </ul>
         </div>`)
        );
    });
    $('#commentPostBtn').click(function(){
        let text = $('#commentPostText').val()
        let userID = $('#userID').val()
        let username = $('#username').val()
        let fd = {"userID": userID, "recipeID": recipeID,"username": username, "text": text}

        if(text.length > 0 && userID != null){
            //return no border
            $('#commentPostText').css('border', 'none');
            //ajax post
            $.ajax({
                url:'/comments',
                method:"POST",
                data: fd,
                
                success: (data) =>{
                    console.log(data)
                    
                }
            
            });
        }else{
            //make red border if no text
            $('#commentPostText').css('border', '1px solid red')
        }












        //to empty the textbox once post happens
        $('#commentPostText').val('')
    });

    
    







});