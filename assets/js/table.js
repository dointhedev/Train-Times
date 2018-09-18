/*::::::::FIREBASE CONNECT:::::::::*/
const config = {
  apiKey: "AIzaSyA29ZBJTWfCBQJHnBr4bGp-2Ut4cmGcw9U",
  authDomain: "train-times-16959.firebaseapp.com",
  databaseURL: "https://train-times-16959.firebaseio.com",
  projectId: "train-times-16959",
  storageBucket: "train-times-16959.appspot.com",
  messagingSenderId: "369862402908"
};

// Initialize Firebase connection.
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
$(document).ready(fireGet);

/*::::::::EVENT LISTENERS:::::::::*/
$("body").on("click", '.dr', delTrain);
$("body").on("click", '.edit', editTrain);
$("body").on("submit", '#trains', processForm);

// This function is the initial request and laoding of data.
function fireGet() {
  $('#thead').empty();
  genTable();
  database = firebase.database();
  const ref = database.ref();
  ref.on("value", function (snapshot) {
    const trnDta = snapshot.val();
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

// Function to delete train. 
function delTrain(e) {
  e.preventDefault();
  const key = $(this).data('key');
  if (confirm('Are you sure?')) {
    firebase.database().ref().child(key).remove();
    tableResults.html(' ');
    fireGet();
  }
}

// Function to edit train. 
function editTrain(e) {
  e.preventDefault();
  const id = e.target.id;
  $(this).siblings(`#${id}`).html(genIcon("times")).removeClass("dr").addClass("reload").click(fireGet);
  $(this).removeClass("edit bg-primary ml-2").addClass("bg-success mt-2").html(genIcon("check")).click(update);
  $(".edit").removeClass("ml-2").addClass("mt-2");
  const tr = $(`#tr${id}`);
  tr.find('td').each(function (i) {
    if ((i === 2) || (i === 3)) {
      $(this).html(genEle("<input>", null, "inActive", null).val($(this).html()));
    }
  });
}

// Function to convert server time in a format humans can read. 
function convertTime(time) {
  const d = new Date(time);
  return d.toLocaleString();
}

// Process train form. 
function processForm(e) {
  e.preventDefault();
  tName = $("#inputName").val().trim();
  dest = $("#inputDest").val().trim();
  fTrain = $("#inputTime").val().trim();
  freq = $("#inputFreq").val().trim();

  if (fTrain.match(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/)) {
    const ans = findNextTrain(fTrain, freq);
    createFire(tName, dest, freq, ans[0], ans[1]);
  } else {
    alert("First Train Time needs to be in proper Military Time Format.");
  }
}

// This is the logic when updating a train. 
function update(e) {
  const key = e.target.dataset.key;
  const id = e.target.id;
  let nArr = [];
  $(`#tr${id}`).find('input').each(function (i) {
    var text = $(this).val();
    nArr.push(text);
  });
  updateFire(key, nArr[0], nArr[1]);
}

// Create operation for Firebase. 
function createFire(tName, dest, freq, nextA, tArrival) {
  database.ref().push({
    date: firebase.database.ServerValue.TIMESTAMP,
    tName: tName,
    dest: dest,
    freq: freq,
    nextA: nextA,
    tArrival: tArrival,
  });
  clear();
}

// Update operation for Firebase. 
function updateFire(key, tName, dest) {
  database.ref().child(key).update({
    date: firebase.database.ServerValue.TIMESTAMP,
    tName: tName,
    dest: dest
  });
  clear();
}

// Reset App.
function clear() {
  document.location.reload();
}

// This function holds the logic behind the calculation of time. 
function findNextTrain(fTrain, freq) {
  const timeArr = fTrain.split(":");
  const trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  const maxMoment = moment.max(moment(), trainTime);
  let tMinutes;
  let tArrival;

  // If the first train is later than the current time, sent arrival to the first train time.
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

// Function to generate the table. 
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

/*::::::::HELPER FUNCTIONS:::::::::*/
// Generate all HTML elements with this function.
function genEle(type, id, className, text) {
  const el = $(type).addClass(className).text(text);
  if (id !== null) {
    el.attr("id", id);
  }
  return el;
}

// Generate all Icons with this function.
function genIcon(type) {
  return $("<i>").addClass(`fa fa-${type} text-white`);
}