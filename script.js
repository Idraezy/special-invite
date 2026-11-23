// The name that must appear in her full name
const REQUIRED_NAME = "Idara Etim";

/* ================================================================ */

const $ = (sel) => document.querySelector(sel);

let herFirstName = "";
let herLocation = "";

/* ---------- Screen navigation ---------- */
function showScreen(id) {
  const next = $("#" + id);
  if (!next) return; // never leave the page blank
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  next.classList.add("active");
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
  herLocation = location;

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
    }, 7000);
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
  setTimeout(() => showScreen("screen-note"), 700);
});

/* ---------- STEP 3: Love note ---------- */
$("#noteNextBtn").addEventListener("click", () => {
  $("#whereInput").value = herLocation;
  showScreen("screen-where");
});

/* ---------- STEP 4: Where are you? ---------- */
$("#whereForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const where = $("#whereInput").value.trim();
  if (!where) {
    $("#whereError").textContent = "Tell me where you are, love 🥺";
    shake($("#whereForm"));
    return;
  }
  $("#whereError").textContent = "";
  $("#pickupFrom").textContent = `from ${where}`;
  showScreen("screen-final");
  // celebration bursts
  for (let i = 0; i < 4; i++) {
    setTimeout(() => burst(
      window.innerWidth * (0.2 + Math.random() * 0.6),
      window.innerHeight * (0.2 + Math.random() * 0.4),
      20
    ), i * 350);
  }
});

// Keep the runaway "No" button on-screen if the window is resized
window.addEventListener("resize", () => {
  if (noBtn.classList.contains("runaway")) moveNoButton();
});

/* ---------- Background music: Happy Birthday (music-box style) ---------- */
// Melody as [note, startBeat, lengthInBeats]
const MELODY = [
  ["G4", 0, .75], ["G4", .75, .25], ["A4", 1, 1], ["G4", 2, 1], ["C5", 3, 1], ["B4", 4, 2],
  ["G4", 6, .75], ["G4", 6.75, .25], ["A4", 7, 1], ["G4", 8, 1], ["D5", 9, 1], ["C5", 10, 2],
  ["G4", 12, .75], ["G4", 12.75, .25], ["G5", 13, 1], ["E5", 14, 1], ["C5", 15, 1], ["B4", 16, 1], ["A4", 17, 2],
  ["F5", 19, .75], ["F5", 19.75, .25], ["E5", 20, 1], ["C5", 21, 1], ["D5", 22, 1], ["C5", 23, 3],
];
// Soft bass/chord notes underneath
const BASS = [
  [["C3", "E3", "G3"], 1, 3], [["G2", "B2", "D3"], 4, 3], [["G2", "B2", "F3"], 7, 3], [["C3", "E3", "G3"], 10, 3],
  [["C3", "E3", "G3"], 13, 3], [["F2", "A2", "C3"], 16, 3], [["C3", "E3", "G3"], 20, 2], [["G2", "B2", "D3"], 22, 1],
  [["C3", "E3", "G3"], 23, 3],
];
const LOOP_BEATS = 28;
const BEAT = 60 / 100; // 100 BPM

function noteFreq(n) {
  const names = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const semis = names[n[0]] + (parseInt(n.slice(-1)) + 1) * 12;
  return 440 * Math.pow(2, (semis - 69) / 12);
}

let audioCtx = null, master = null, loopTimer = null, musicOn = false;

function playTone(freq, start, dur, vol, bright) {
  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc2.type = "triangle";
  osc.frequency.value = freq;
  osc2.frequency.value = freq * (bright ? 2 : 1);
  const g2 = audioCtx.createGain();
  g2.gain.value = bright ? 0.15 : 0.3;
  osc.connect(gain);
  osc2.connect(g2).connect(gain);
  gain.connect(master);
  const end = start + Math.max(dur, 0.4) + 0.6;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, end);
  osc.start(start); osc2.start(start);
  osc.stop(end); osc2.stop(end);
}

function scheduleLoop() {
  const t0 = audioCtx.currentTime + 0.1;
  MELODY.forEach(([n, b, l]) => playTone(noteFreq(n), t0 + b * BEAT, l * BEAT, 0.35, true));
  BASS.forEach(([notes, b, l]) =>
    notes.forEach((n) => playTone(noteFreq(n), t0 + b * BEAT, l * BEAT, 0.08, false))
  );
  loopTimer = setTimeout(scheduleLoop, LOOP_BEATS * BEAT * 1000);
}

const musicBtn = $("#musicBtn");

function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.35;
    master.connect(audioCtx.destination);
    scheduleLoop();
  }
  audioCtx.resume();
  musicOn = true;
  musicBtn.textContent = "🎵";
  musicBtn.classList.remove("waiting");
  musicBtn.classList.add("playing");
}

function stopMusic() {
  if (audioCtx) audioCtx.suspend();
  musicOn = false;
  musicBtn.textContent = "🔇";
  musicBtn.classList.remove("playing");
}

musicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  musicOn ? stopMusic() : startMusic();
});

// Browsers only allow sound after the first tap/key press, so start then
function firstInteraction(e) {
  if (e && musicBtn.contains(e.target)) return; // the button handles itself
  if (!audioCtx) startMusic();
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    document.removeEventListener(ev, firstInteraction)
  );
}
["pointerdown", "keydown", "touchstart"].forEach((ev) =>
  document.addEventListener(ev, firstInteraction)
);
