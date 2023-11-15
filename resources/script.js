const targetDate = new Date();
targetDate.setHours(targetDate.getHours() + 25);

function getTimeSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector(".segment-display");
  const segmentDisplayTop = segmentDisplay.querySelector(
    ".segment-display__top"
  );
  const segmentDisplayBottom = segmentDisplay.querySelector(
    ".segment-display__bottom"
  );

  const segmentOverlay = segmentDisplay.querySelector(".segment-overlay");
  const segmentOverlayTop = segmentOverlay.querySelector(
    ".segment-overlay__top"
  );
  const segmentOverlayBottom = segmentOverlay.querySelector(
    ".segment-overlay__bottom"
  );

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
}

function updateSegmentValues(displayElement, overlayElement, value) {
  displayElement.textContent = value;
  overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue) {
  const segmentElements = getTimeSegmentElements(segmentElement);

  if (
    parseInt(segmentElements.segmentDisplayTop.textContent, 10) === timeValue
  ) {
    return;
  }

  segmentElements.segmentOverlay.classList.add("flip");

  updateSegmentValues(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  function finishAnimation() {
    segmentElements.segmentOverlay.classList.remove("flip");
    updateSegmentValues(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener("animationend", finishAnimation);
  }

  segmentElements.segmentOverlay.addEventListener(
    "animationend",
    finishAnimation
  );
}

function updateTimeSection(sectionID, timeValue) {
  const firstNumber = Math.floor(timeValue / 10) || 0;
  const secondNumber = timeValue % 10 || 0;
  const sectionElement = document.getElementById(sectionID);
  const timeSegments = sectionElement.querySelectorAll(".time-segment");

  updateTimeSegment(timeSegments[0], firstNumber);
  updateTimeSegment(timeSegments[1], secondNumber);
}

function getTimeRemaining(targetDateTime) {
  const nowTime = Date.now();
  const complete = nowTime >= targetDateTime;

  if (complete) {
    return {
      complete,
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
  }

  const secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);
  const hours = Math.floor(secondsRemaining / 60 / 60);
  const minutes = Math.floor(secondsRemaining / 60) - hours * 60;
  const seconds = secondsRemaining % 60;

  return {
    complete,
    seconds,
    minutes,
    hours,
  };
}

function updateAllSegments() {
  const timeRemainingBits = getTimeRemaining(new Date(targetDate).getTime());

  updateTimeSection("seconds", timeRemainingBits.seconds);
  updateTimeSection("minutes", timeRemainingBits.minutes);
  updateTimeSection("hours", timeRemainingBits.hours);

  return timeRemainingBits.complete;
}

let countdownTimer = null; // Declare countdownTimer variable outside the setInterval function
let isCountdownActive = false; // Variable to track countdown status




updateAllSegments();


let play = document.getElementById("playButton");
let pause = document.getElementById("pauseButton");
let reset = document.getElementById('resetButton');

// Your existing code...


function startCountdown() {
  countdownTimer = setInterval(() => {
    const isComplete = updateAllSegments();

    if (isComplete) {
      clearInterval(countdownTimer);
      isCountdownActive = false; // Update countdown status when it completes
    }
  }, 1000);
}

function resetCountdown() {
  clearInterval(countdownTimer);
  isCountdownActive = false; // Update countdown status when it's reset
  const now = new Date(); // Reset targetDate to current time
  targetDate.setTime(now.getTime() + 5 * 60 * 60 * 1000); // Adjust to 5 hours from now

  updateTimeSection("seconds", 0); // Update all segments to display zeros
  updateTimeSection("minutes", 0);
  updateTimeSection("hours", 0);
}

function pauseCountdown() {
  clearInterval(countdownTimer);
  isCountdownActive = false; // Update countdown status when it's manually paused
}

function playCountdown() {
  if (!isCountdownActive) {
    startCountdown();
    isCountdownActive = true; // Update countdown status when it's manually started
  }
}

reset.addEventListener('click', resetCountdown);
play.addEventListener('click', playCountdown);
pause.addEventListener('click', pauseCountdown);
// Ensure to call startCountdown() to begin the countdown initially


// Function to play the bell sound
function playBellSound() {
  const bell = new Audio('resources/mixkit-attention-bell-ding-586.wav'); // Replace 'path_to_your_bell_sound.mp3' with your audio file path
  bell.play();
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    const isComplete = updateAllSegments();

    if (isComplete) {
      clearInterval(countdownTimer);
      isCountdownActive = false; // Update countdown status when it completes
      playBellSound(); // Play the bell sound when countdown reaches zero
    }
  }, 1000);
}

// Rest of your code remains unchanged...
