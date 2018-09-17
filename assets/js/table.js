/*::::::::FireBase Connect:::::::::*/
const config = {
  apiKey: "AIzaSyA29ZBJTWfCBQJHnBr4bGp-2Ut4cmGcw9U",
  authDomain: "train-times-16959.firebaseapp.com",
  databaseURL: "https://train-times-16959.firebaseio.com",
  projectId: "train-times-16959",
  storageBucket: "train-times-16959.appspot.com",
  messagingSenderId: "369862402908"
};
firebase.initializeApp(config);

/*::::::::GLOBAL VARIABLES:::::::::*/
let database = "";
let tName = "";
let dest = "";
let fTrain = "";
let freq = "";
const icon = '<i class="fa fa-trash-o text-white"></i>';
const d = new Date();

/*::::::::DATA:::::::::*/
const tblHed = ["Train ID", "Time Added", "Train Name", "Destination", "Frequency (min)", "Next Arrival", "Minutes Away", "Actions"];

/*::::::::DOM CACHE:::::::::*/
const thead = $("#thead");
const tableResults = $("#tableResults");

/*::::::::MAIN APP JS:::::::::*/
$(document).ready(jsSetup);

$("body").on("click",'.dr', delTrain);
$("body").on("click",'.edit', editTrain);
$("body").on("submit",'#trains', processForm);



function fireGet() {
  database = firebase.database();
  const ref = database.ref();
  const trash = genIcon("trash-o");
  console.log(trash[0])
  ref.on("value", function(snapshot) {
    const trnDta = snapshot.val();
    const keys = Object.keys(trnDta);
    for (let x = 0; x < keys.length; x++) {
      const k = keys[x];
      let fireData = "";
      fireData += "<tr class='dataRW' id='tr" + x + "'>";
      fireData += "<td>" + x + "</td>";
      fireData += "<td>" + trnDta[k].date + "</td>";
      fireData += "<td>" + trnDta[k].tName + "</td>";
      fireData += "<td>" + trnDta[k].dest + "</td>";
      fireData += "<td>" + trnDta[k].freq + "</td>";
      fireData += "<td>" + trnDta[k].fTrain + "</td>";
      fireData += "<td>" +  trnDta[k].fTrain + "</td>";
      fireData += "<td><button class='btn dr bg-danger' data-key='" + k  + "'>" + trash  + "</button><button id='" + x + "' class='btn edit btn-primary' data-key='" + k  + "'>" + icon + "</button></td>";
      fireData += "</tr>";
      
      $("#thead").append(fireData);
    }
}); 
}

function delTrain(e){
  e.preventDefault();
   const key = $(this).data('key');
   if(confirm('Are you sure?')){
      firebase.database().ref().child(key).remove();
      tableResults.html(' ');
      genTable();
      fireGet();
   }
}

function editTrain(e){
  e.preventDefault();
 $(this).removeClass("btn-primary").addClass("btn-success")
  const tr = $(`#tr${e.target.id}`)
  console.log(tr);
  tr.find('td').each(function(i, el) {
    if((i === 1 ) || (i === 2 ) || (i === 3 ) || (i === 4 )) {
    $(this).html(`<textarea>${$(this).html()}</textarea>`);
    }
  });  
//   $('#save').show();
//   $('.info').fadeIn('fast');

// $('#save').click(function(){
//   $('#save, .info').hide();
//   $('textarea').each(function(){
//     var content = $(this).val();//.replace(/\n/g,"<br>");
//     $(this).html(content);
//     $(this).contents().unwrap();    
//   }); 

//   $('#edit').show(); 
//   alert(e.target);
// });
}

function processForm(e) {
  e.preventDefault();
    tableResults.html(' ');
    genTable();
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
}


function genTable() {
  const table = genEle("<table>", null, "table", null); 
  const tblHD = genEle("<table>", "thead", "table", null); 
  const tr = $("<tr>");
   for (let i of tblHed ){
    const th = genEle("<th>", null, null, i); 
    tr.append(th);
   }
  tblHD.append(tr);
  tableResults.html(table.append(tblHD));
}

function jsSetup() {
  genTable();
  fireGet();
}

/*::::::::HELPER FUNCTIONS:::::::::*/
function genEle(type, id, className, text) {
  const el = $(type).addClass(className).text(text);
  if (id !== null){
    el.attr("id", id);
  }
return el;
}

function genIcon(type){
  return $("<i>").addClass(`fa fa-${type} text-white`);
}