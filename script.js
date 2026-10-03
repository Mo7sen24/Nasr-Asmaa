// ===============================
// CONFIGURATION & EVENT DETAILS
// ===============================
const EVENT_TIME = "19:00";
const GOOGLE_SCRIPT_URL = "PUT_YOUR_GOOGLE_SCRIPT_URL_HERE";

// Wedding Date: October 10, 2026 at 8:00 PM
const weddingDate = new Date(`2026-11-06T${EVENT_TIME}:00`);

// ===============================
// COUNTDOWN TIMER
// ===============================
function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML =
      '<h3 style="color:var(--pink-dark); font-family:\'Playfair Display\', serif;">TODAY IS THE WEDDING DAY! 💕</h3>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===============================
// RSVP SUBMISSION
// ===============================
document.getElementById("rsvpForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const guests = document.getElementById("guests").value;
  const statusMsg = document.getElementById("rsvpMessage");

  if (!name || !attendance) {
    statusMsg.textContent = "Please fill in all required fields.";
    return;
  }

  statusMsg.textContent = "Sending RSVP...";

  try {
    const formData = new FormData();
    formData.append("type", "rsvp");
    formData.append("name", name);
    formData.append("attendance", attendance);
    formData.append("guests", guests);

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    statusMsg.textContent = attendance === "yes"
      ? `Thank you ${name}! We can't wait to celebrate with you 💕`
      : `Thank you for letting us know, ${name}.`;

    this.reset();
    document.getElementById("guests").value = 1;

  } catch (err) {
    console.error("RSVP Error:", err);
    statusMsg.textContent = "Something went wrong. Please try again.";
  }
});

// ===============================
// WISHES SUBMISSION
// ===============================
document.getElementById("wishForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("wishName").value.trim();
  const message = document.getElementById("wishMessage").value.trim();
  const statusMsg = document.getElementById("wishStatusMessage");

  if (!name || !message) {
    statusMsg.textContent = "Please fill in all fields.";
    return;
  }

  statusMsg.textContent = "Sending wishes...";

  try {
    const formData = new FormData();
    formData.append("type", "wish");
    formData.append("name", name);
    formData.append("message", message);

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    statusMsg.textContent = `Thank you ${name}! Your warm wishes mean a lot 💕`;
    this.reset();

  } catch (err) {
    console.error("Wish Error:", err);
    statusMsg.textContent = "Something went wrong. Please try again.";
  }
});
