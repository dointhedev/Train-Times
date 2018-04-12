/*:::::::: FireBase Connect :::::::::*/
var config = {
  apiKey: "AIzaSyA29ZBJTWfCBQJHnBr4bGp-2Ut4cmGcw9U",
  authDomain: "train-times-16959.firebaseapp.com",
  databaseURL: "https://train-times-16959.firebaseio.com",
  projectId: "train-times-16959",
  storageBucket: "train-times-16959.appspot.com",
  messagingSenderId: "369862402908"
};
firebase.initializeApp(config);

/*:::::::: GLOBAL VARIABLES :::::::::*/
var database = "";
var tblHed = ["Train ID", "Time Added", "Train Name", "Destination", "Frequency (min)", "Next Arrival", "Minutes Away", "Remove"];
var thead = $("#thead");
var tableResults = $("#tableResults");
var tName = "";
var dest = "";
var fTrain = "";
var freq = "";
var icon = '<i class="fa fa-trash-o text-white"></i>';
var d = new Date();

$(document).ready(function () {
  jsSetup();
});

function fireGet() {
  database = firebase.database();
  var ref = database.ref();
  ref.on("value", function(snapshot) {
    var trnDta = snapshot.val();
    var keys = Object.keys(trnDta);
    for (var x = 0; x < keys.length; x++) {
      var k = keys[x];
      var date = trnDta[k].date;
      var fireData = "";
      fireData += "<tr class='dataRW' id='tr" + x + "'>";
      fireData += "<td>" + x + "</td>";
      fireData += "<td>" + trnDta[k].date + "</td>";
      fireData += "<td>" + trnDta[k].tName + "</td>";
      fireData += "<td>" + trnDta[k].dest + "</td>";
      fireData += "<td>" + trnDta[k].freq + "</td>";
      fireData += "<td>" + trnDta[k].fTrain + "</td>";
      fireData += "<td>" +  trnDta[k].fTrain + "</td>";
      fireData += "<td><button class='btn dr bg-danger' data-key='" + k  + "'>" + icon + "</button></td>";
      fireData += "</tr>";
      
      $("#thead").append(fireData);
    }
}); 
}

$("body").on("click",'.dr', function (e) {
  e.preventDefault();
  var key = $(this).data('key');
  console.log(key);
   if(confirm('Are you sure?')){
      firebase.database().ref().child(key).remove();
      tableResults.html(' ');
      results();
      fireGet();
   }
});

function processForm() {
  $('#trains').submit(function (e) {
    e.preventDefault();
    tableResults.html(' ');
    results();
    console.log("processing");

    date = d.toLocaleString([], {
      hour12: true
    });
    tName = $("#inputName").val().trim();
    dest = $("#inputDest").val().trim();
    fTrain = $("#inputTime").val().trim();
    // I was trying to figure this out. I am going to push this to repo and continue to work on it. 
  // var  randomDate = fTrain;
  // var randomFormat = "MM/DD/YYYY";
  // var convertedDate = moment(randomDate, randomFormat);
  //   console.log(convertedDate);
  //   console.log(moment(convertedDate).toNow());
  //   freq = $("#inputFreq").val().trim();
  //   console.log(moment(convertedDate).format("MM/DD/YY"));
  //   console.log(moment(convertedDate).format("MMM Do, YYYY hh:mm:ss"));
  //   console.log(moment(convertedDate).format("X"));
  //   console.log("----------------------------------------");

  //   // 2 ...to determine the time in years, months, days between today and the randomDate
  //   console.log(moment(convertedDate).toNow());
  //   console.log(moment(convertedDate).diff(moment(), "years"));
  //   console.log(moment(convertedDate).diff(moment(), "months"));
  //   console.log(moment(convertedDate).diff(moment(), "days"));
  //   console.log("----------------------------------------");
  //   console.log(moment().startOf('12').fromNow());    
    database.ref().push({
      date: date,
      tName: tName,
      dest: dest,
      fTrain: fTrain,
      freq: freq
    });
  });

}


function results() {
  var table = $("<table class='table'>");
  var tblHD = $("<thead id='thead'>");
  var tr = $("<tr>");
  for (var i = 0; i < tblHed.length; i++) {
    var th = $("<th scope='col'>");
    th.text(tblHed[i]);
    tr.append(th);
  }
  tblHD.append(tr);
  table.append(tblHD);
  tableResults.html(table);
}

function jsSetup() {
  results();
  fireGet();
  processForm();
}