/* ================================================================
   ✏️  EDIT THESE DETAILS — where and when you'll meet her
   ================================================================ */
const DATE_DETAILS = {
  place: "To be revealed soon 😉",
  date:  "Coming soon…",
  time:  "Coming soon…",
  note:  "Wear something comfy and bring your beautiful smile 💕",
};

// The name that must appear in her full name
const REQUIRED_NAME = "Idara Etim";

/* ================================================================ */

const $ = (sel) => document.querySelector(sel);

let herFirstName = "";

/* ---------- Screen navigation ---------- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Floating hearts background ---------- */
const HEARTS = ["💗", "💖", "💕", "💞", "❤️", "🌸", "✨"];
function spawnHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  const duration = 7 + Math.random() * 7;
  h.style.animationDuration = duration + "s";
  $("#heartsBg").appendChild(h);
  setTimeout(() => h.remove(), duration * 1000);
}
setInterval(spawnHeart, 600);
for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 200);

/* ---------- Heart confetti burst ---------- */
function burst(x, y, count = 18) {
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.className = "burst";
    b.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    b.style.left = x + "px";
    b.style.top = y + "px";
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 140;
    b.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    b.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    b.style.setProperty("--rot", Math.random() * 360 + "deg");
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1400);
  }
}

function shake(el) {
  el.classList.remove("shake");
  void el.offsetWidth; // restart animation
  el.classList.add("shake");
}

/* ---------- STEP 1: Name & location ---------- */
$("#detailsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = $("#fullName").value.trim().replace(/\s+/g, " ");
  const location = $("#location").value.trim();
  const error = $("#formError");

  if (!fullName || !location) {
    error.textContent = "Please fill in both your name and location 🥺";
    shake($("#detailsForm"));
    return;
  }
  error.textContent = "";

  const hasRequiredName = fullName.toLowerCase().includes(REQUIRED_NAME.toLowerCase());

  if (!hasRequiredName) {
    showScreen("screen-wrong");
    const bar = $("#redirectBar");
    bar.classList.remove("run");
    void bar.offsetWidth;
    bar.classList.add("run");
    setTimeout(() => {
      showScreen("screen-details");
      $("#fullName").focus();
      $("#fullName").select();
    }, 3500);
    return;
  }

  // Use her first name (whatever comes before "Idara Etim") for greetings
  const otherPart = fullName.replace(new RegExp(REQUIRED_NAME, "i"), "").trim();
  herFirstName = otherPart.split(" ")[0] || "my love";
  $("#loveGreeting").textContent = `Hi ${herFirstName},`;
  showScreen("screen-love");
});

/* ---------- STEP 2: Do you love me? ---------- */
const noBtn = $("#noBtn");
const yesBtn = $("#yesBtn");
const NO_TAUNTS = [
  "Are you sure? 🥺",
  "Try again 😏",
  "Wrong button, babe 😂",
  "That button is shy 🙈",
  "Nope, not allowed 🚫",
  "You know you love me 💕",
  "Just click Yes already 😩",
  "I'll keep running 🏃‍♂️",
];
let noCount = 0;

function moveNoButton() {
  noBtn.classList.add("runaway");
  const pad = 16;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;
  let x, y;
  // Avoid landing right on top of the Yes button
  const yesRect = yesBtn.getBoundingClientRect();
  for (let tries = 0; tries < 20; tries++) {
    x = pad + Math.random() * Math.max(0, maxX - pad);
    y = pad + Math.random() * Math.max(0, maxY - pad);
    const overlaps =
      x < yesRect.right + 20 && x + noBtn.offsetWidth > yesRect.left - 20 &&
      y < yesRect.bottom + 20 && y + noBtn.offsetHeight > yesRect.top - 20;
    if (!overlaps) break;
  }
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  $("#noTaunt").textContent = NO_TAUNTS[noCount % NO_TAUNTS.length];
  noCount++;

  // Make "Yes" grow a little each time she tries "No"
  const scale = Math.min(1 + noCount * 0.08, 1.6);
  yesBtn.style.transform = `scale(${scale})`;
}

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", (e) => {
  burst(e.clientX, e.clientY, 26);
  noBtn.classList.remove("runaway");
  noBtn.style.left = noBtn.style.top = "";
  setTimeout(() => showScreen("screen-dates"), 700);
});

/* ---------- STEP 3: Choose date ---------- */
const LOCKED_MSGS = [
  "Not today, love 😌",
  "That one's locked 🔒",
  "Hmm… try another one 👀",
  "Nope! Keep looking 😉",
];
document.querySelectorAll(".date-option.locked").forEach((btn) => {
  btn.addEventListener("click", () => {
    shake(btn);
    $("#lockedMsg").textContent = LOCKED_MSGS[Math.floor(Math.random() * LOCKED_MSGS.length)];
  });
});

$("#shoppingBtn").addEventListener("click", (e) => {
  burst(e.clientX, e.clientY, 30);
  $("#finalName").textContent = herFirstName ? `${herFirstName} 💕` : "My Love 💕";
  $("#meetPlace").textContent = DATE_DETAILS.place;
  $("#meetDate").textContent = DATE_DETAILS.date;
  $("#meetTime").textContent = DATE_DETAILS.time;
  $("#meetNote").textContent = DATE_DETAILS.note;
  setTimeout(() => {
    showScreen("screen-final");
    // celebration bursts
    for (let i = 0; i < 4; i++) {
      setTimeout(() => burst(
        window.innerWidth * (0.2 + Math.random() * 0.6),
        window.innerHeight * (0.2 + Math.random() * 0.4),
        20
      ), i * 350);
    }
  }, 700);
});

// Keep the runaway "No" button on-screen if the window is resized
window.addEventListener("resize", () => {
  if (noBtn.classList.contains("runaway")) moveNoButton();
});
