// Initialize Firebase
var config = {
  apiKey: "AIzaSyAaa2P63AZv-BdeaP2Kkzh2W_o3x38hvTM",
  authDomain: "train-schedule-87f70.firebaseapp.com",
  databaseURL: "https://train-schedule-87f70.firebaseio.com",
  projectId: "train-schedule-87f70",
  storageBucket: "train-schedule-87f70.appspot.com",
  messagingSenderId: "1042683859824"
};
firebase.initializeApp(config);

var database = firebase.database();

var timeNow;

database.ref().on("child_added", function(snapshot) {
  // convert FIRST TRAIN TIME to unix
  var firstTrain = moment(snapshot.val().firstTrain, "HH:mm").format("X");
  // store frequency as a variable
  var frequency = snapshot.val().frequency;
  // calculate the difference between the first train and the current time
  var difference = moment().diff(moment.unix(firstTrain), "minutes");
  // calculate the times the train has arrived from first to now
  var timeLeft = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
  // calculate the amount of minutes left
  var mins = moment(frequency - timeLeft, "mm").format("mm");
  // add minutes to last arrival for next arrival
  var nextTrain = moment().add(mins, "m").format("hh:mm A");

  var newRow = $("<tr>");
  var newName = $("<td>");
  var newDestination = $("<td>");
  var newFrequency = $("<td>");
  var newNextArrival = $("<td>");
  var newMinutes = $("<td>");

  newName.html(snapshot.val().trainName);
  newDestination.html(snapshot.val().destination);
  newFrequency.html(snapshot.val().frequency);
  newNextArrival.html(nextTrain);
  newMinutes.html(mins);

  newRow.append(newName);
  newRow.append(newDestination);
  newRow.append(newFrequency);
  newRow.append(newNextArrival);
  newRow.append(newMinutes);

  $("tbody").append(newRow);
});

$("#submitNewTrain").on("click", function(e) {
  e.preventDefault();

  // grab the first train time convert to 24hr time
  var inputTrain = $("#newTrainName").val();
  var inputDestination = $("#newDestination").val();
  var inputFirstTrain = moment(
    $("#newFirstTrain").val().trim(),
    "hh:mm a"
  ).format("HH:mm");
  var inputFrequency = $("#newFrequency").val().trim();

  if (
    inputTrain.length > 0 &&
    inputDestination.length > 0 &&
    inputFirstTrain.length > 0 &&
    inputFrequency.length > 0
  ) {
    database.ref().push({
      trainName: inputTrain,
      destination: inputDestination,
      firstTrain: inputFirstTrain,
      frequency: inputFrequency
    });
  }

  $("#newTrainName").val("");
  $("#newDestination").val("");
  $("#newFirstTrain").val("");
  $("#newFrequency").val("");
});