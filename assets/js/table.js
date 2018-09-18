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

$("body").on("click", '.dr', delTrain);
$("body").on("click", '.edit', editTrain);
$("body").on("submit", '#trains', processForm);



function fireGet() {
  $('#thead').empty();
  genTable()
  database = firebase.database();
  const ref = database.ref();
  ref.on("value", function (snapshot) {
    const trnDta = snapshot.val();
    console.log(trnDta)
    const keys = Object.keys(trnDta);
    for (let x = 0; x < keys.length; x++) {
      const k = keys[x];
      const tr = genEle("<tr>", `tr${x}`, "dataRW", null);
      const id = genEle("<td>", null, null, x);
      const date = genEle("<td>", null, null, convertTime(trnDta[k].date));
      const tName = genEle("<td>", null, null, trnDta[k].tName);
      const dest = genEle("<td>", null, null, trnDta[k].dest);
      const freq = genEle("<td>", null, null, trnDta[k].freq);
      const ftrain = genEle("<td>", null, null, trnDta[k].nextA);
      const btrain = genEle("<td>", null, null, trnDta[k].tArrival);
      const actions = genEle("<td>", null, null, null);
      const dBtn = genEle("<button>", x, `btn dr bg-danger tr${x}`, null).append(genIcon("trash-o")).attr("data-key", k);
      const eBtn = genEle("<button>", x, `btn edit bg-primary ml-2 tr${x}`, null).append(genIcon("edit")).attr("data-key", k);
      actions.append(dBtn, eBtn);
      tr.append(id, date, tName, dest, freq, ftrain, btrain, actions);
      $("#thead").append(tr);
    }
  });
}


function delTrain(e) {
  e.preventDefault();
  const key = $(this).data('key');
  if (confirm('Are you sure?')) {
    firebase.database().ref().child(key).remove();
    tableResults.html(' ');
    genTable();
    fireGet();
  }
}

function editTrain(e) {
  e.preventDefault();
  const id = e.target.id;
  $(this).siblings(`#${id}`).html(genIcon("times")).removeClass("dr").addClass("reload").click(fireGet);
  $(this).removeClass("bg-primary ml-2").addClass("bg-success mt-2").html(genIcon("check"));
  $(".edit").removeClass("ml-2").addClass("mt-2")
  const tr = $(`#tr${id}`)
  console.log(tr);
  tr.find('td').each(function (i) {
    if ((i === 2) || (i === 3) || (i === 4)) {
      $(this).html(genEle("<input>", null, "inActive", null).val($(this).html()));
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

function convertTime(time) {
  const d = new Date(time);
  return d.toLocaleString();
}

function processForm(e) {
  e.preventDefault();
  tableResults.html(' ');
  tName = $("#inputName").val().trim();
  dest = $("#inputDest").val().trim();
  fTrain = $("#inputTime").val().trim();
  freq = $("#inputFreq").val().trim();
  const ans = findNextTrain(fTrain, freq)
  createFire(tName, dest, fTrain, freq, ans[0], ans[1]);
  genTable();
  clearForm();
}



function createFire(tName, dest, fTrain, freq, nextA, tArrival) {
  database.ref().push({
    date: firebase.database.ServerValue.TIMESTAMP,
    tName: tName,
    dest: dest,
    fTrain: fTrain,
    freq: freq,
    nextA: nextA,
    tArrival: tArrival,

  });
}

function clearForm() {
  $("#trains").trigger('reset');
}

function findNextTrain(fTrain, freq) {
  const timeArr = fTrain.split(":");
  const trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  const maxMoment = moment.max(moment(), trainTime);
  let tMinutes;
  let tArrival;

  // If the first train is later than the current time, sent arrival to the first train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    const differenceTimes = moment().diff(trainTime, "minutes");
    const tRemainder = differenceTimes % freq;
    tMinutes = freq - tRemainder;
    // To calculate the arrival time, add the tMinutes to the current time
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");

  }
  return [tArrival, tMinutes]
}

function genTable() {
  const table = genEle("<table>", null, "table", null);
  const tblHD = genEle("<table>", "thead", "table", null);
  const tr = $("<tr>");
  for (let i of tblHed) {
    const th = genEle("<th>", null, null, i);
    tr.append(th);
  }
  tblHD.append(tr);
  tableResults.html(table.append(tblHD));
}

function jsSetup() {
  fireGet();
}

/*::::::::HELPER FUNCTIONS:::::::::*/
function genEle(type, id, className, text) {
  const el = $(type).addClass(className).text(text);
  if (id !== null) {
    el.attr("id", id);
  }
  return el;
}

function genIcon(type) {
  return $("<i>").addClass(`fa fa-${type} text-white`);
}