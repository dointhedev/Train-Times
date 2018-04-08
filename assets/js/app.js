/*jshint esversion: 6 */
//SENDBIRD 
var appId="C467D171-6024-43EC-9943-FE2E0478AFBD";
var apiToken="623cd37c96fc7faf33dd41b5e68894169d567d91";


//Ajax 
var queryURL = "https://api.sendbird.com";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);
});


//Firebase
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD55v0OO7fbqD_SZqP0D4bw-2DrC5GUpDQ",
    authDomain: "group-project-1-ca0dc.firebaseapp.com",
    databaseURL: "https://group-project-1-ca0dc.firebaseio.com",
    projectId: "group-project-1-ca0dc",
    storageBucket: "group-project-1-ca0dc.appspot.com",
    messagingSenderId: "906231816914"
  };
  firebase.initializeApp(config);
