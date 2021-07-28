$(document).ready(function(){
  $(".button").on("click", function(event){
    event.preventDefault();
    //Fetch form data and send POST request to server
    var messageText = $("#message-box-text").val().trim();
    if(messageText!=""){
      console.log(messageText);
      $("#message-box-text").val("");

      //Show message in green bubble
      var div = document.createElement('div');
      div.setAttribute('class', 'message-hist-user');
      div.innerHTML = `
        <label class="message-user" disabled="true">Review: <br> ${messageText}</label>
      `;
      document.getElementById('message-hist').appendChild(div);

      //Show loading in blue bubble
      var div = document.createElement('div');
      div.setAttribute('class', 'message-hist-bot');
      div.innerHTML = `
        <label class="message-bot" disabled="true">LOADING...</label>
      `;
      document.getElementById('message-hist').appendChild(div);

      $.ajax({
          url: "http://127.0.0.1:5000/predict",
          type: 'POST',
          data: JSON.stringify(messageText),
          cache: false,
          success: function(response) {
            //Show response in blue bubble 
            document.getElementById("message-hist").lastChild.innerHTML = `
              <label class="message-bot" disabled="true">Thank you for your feedback! <br> Sentiment : <br> ${response['result']} <br> Predicted score : ${response['pred']} <br> Model accuracy : ${response['accuracy']}</label>
            `;
          },
          contentType: "application/json",
          dataType: 'json'
      });
    }
    else{
      alert("Review cannot be empty!");
    }
  });
});

function openTab(evt, tabName) {
    //Some element stylings
    $("hr").hide();
    $("#outForm").hide();

    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "";
    evt.currentTarget.className += " active";
}

function closeTab(tabName){
    //Close the tab
    document.getElementById(tabName).style.display="none";
}