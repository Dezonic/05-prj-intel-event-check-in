// Intel Sustainability Summit Check-In

// Get elements from the HTML
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

// Attendance goal
const attendanceGoal = 50;

// Load saved information from localStorage
let totalAttendees = Number(localStorage.getItem("totalAttendees")) || 0;

let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0
};

let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// Create the attendee list section
const attendeeListSection = document.createElement("div");
attendeeListSection.className = "attendee-list";

const attendeeListTitle = document.createElement("h3");
attendeeListTitle.textContent = "Attendee List";

const attendeeList = document.createElement("div");
attendeeList.id = "attendeeList";

attendeeListSection.appendChild(attendeeListTitle);
attendeeListSection.appendChild(attendeeList);

// Add the attendee list underneath the team statistics
document.querySelector(".team-stats").appendChild(attendeeListSection);

// Create the celebration message
const celebration = document.createElement("div");
celebration.id = "celebration";
celebration.className = "success-message";
celebration.style.display = "none";
celebration.style.marginTop = "20px";
celebration.style.padding = "20px";
celebration.style.borderRadius = "12px";
celebration.style.fontWeight = "600";

document.querySelector(".container").appendChild(celebration);


// Update everything displayed on the page
function updateDisplay() {
  // Update total attendance
  attendeeCount.textContent = totalAttendees;

  // Calculate progress toward the goal
  let progress = (totalAttendees / attendanceGoal) * 100;

  // Keep the progress bar from going over 100%
  if (progress > 100) {
    progress = 100;
  }

  progressBar.style.width = `${progress}%`;

  // Update team counts
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;

  // Update attendee list
  updateAttendeeList();

  // Check whether the attendance goal has been reached
  if (totalAttendees >= attendanceGoal) {
    showCelebration();
  }
}


// Update the attendee list
function updateAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No attendees have checked in yet.";
    emptyMessage.style.color = "#64748b";

    attendeeList.appendChild(emptyMessage);
    return;
  }

  attendees.forEach(function (attendee) {
    const attendeeItem = document.createElement("div");

    attendeeItem.style.padding = "10px";
    attendeeItem.style.marginBottom = "8px";
    attendeeItem.style.backgroundColor = "#f8fafc";
    attendeeItem.style.borderRadius = "8px";
    attendeeItem.style.textAlign = "left";

    attendeeItem.textContent = `${attendee.name} — ${attendee.team}`;

    attendeeList.appendChild(attendeeItem);
  });
}


// Show the celebration message
function showCelebration() {
  // Find the highest team count
  const highestCount = Math.max(
    teamCounts.water,
    teamCounts.zero,
    teamCounts.power
  );

  // Find the winning team or teams
  const winningTeams = [];

  if (teamCounts.water === highestCount) {
    winningTeams.push("Team Water Wise");
  }

  if (teamCounts.zero === highestCount) {
    winningTeams.push("Team Net Zero");
  }

  if (teamCounts.power === highestCount) {
    winningTeams.push("Team Renewables");
  }

  let winnerText;

  if (winningTeams.length === 1) {
    winnerText = `${winningTeams[0]} is currently in the lead!`;
  } else {
    winnerText = `It's a tie between ${winningTeams.join(" and ")}!`;
  }

  celebration.innerHTML = `
    🎉 <strong>Attendance Goal Reached!</strong><br>
    We reached ${attendanceGoal} attendees!<br>
    🏆 ${winnerText}
  `;

  celebration.style.display = "block";
}


// Listen for the form submission
checkInForm.addEventListener("submit", function (event) {
  // Prevent the page from refreshing
  event.preventDefault();

  // Get the attendee's name
  const name = attendeeNameInput.value.trim();

  // Get the selected team
  const team = teamSelect.value;

  // Make sure both values are provided
  if (name === "" || team === "") {
    return;
  }

  // Increase the total attendance count
  totalAttendees++;

  // Increase the selected team's count
  teamCounts[team]++;

  // Get the full team name for the greeting and attendee list
  let teamName;

  if (team === "water") {
    teamName = "Team Water Wise";
  } else if (team === "zero") {
    teamName = "Team Net Zero";
  } else if (team === "power") {
    teamName = "Team Renewables";
  }

  // Add the attendee to the attendee list
  attendees.push({
    name: name,
    team: teamName
  });

  // Create the personalized greeting
  greeting.textContent = `Welcome, ${name}! You're checked in with ${teamName}.`;

  // Show the greeting
  greeting.style.display = "block";
  greeting.className = "success-message";

  // Save the updated information to localStorage
  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));

  // Update the page
  updateDisplay();

  // Reset the form
  checkInForm.reset();

  // Put the cursor back in the name field
  attendeeNameInput.focus();
});


// Display saved information when the page loads
updateDisplay();