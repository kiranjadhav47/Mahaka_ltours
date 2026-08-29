const KEY = "mahakal_trips_v1";

const sample = [
  {
    id: "sample1",
    from: "Pune",
    to: "Ujjain",
    date: "2026-09-05",
    time: "05:00",
    seats: 3,
    fare: 0
  }
];

function getTrips() {
  let x = JSON.parse(localStorage.getItem(KEY) || "null");

  if (x === null) {
    localStorage.setItem(KEY, JSON.stringify(sample));
    return sample;
  }

  return x;
}

function waLink(t) {
  const msg =
    `Hello Mahakal Tour & Travel,%0A` +
    `I want to book/enquire about this trip.%0A%0A` +
    `Pickup: ${t.from}%0A` +
    `Drop: ${t.to}%0A` +
    `Date: ${t.date}%0A` +
    `Time: ${t.time}%0A` +
    `Available seats shown: ${t.seats}%0A%0A` +
    `Name: %0A` +
    `Passengers: `;

  return `https://wa.me/919630783154?text=${msg}`;
}

function renderTrips(list = getTrips()) {
  const box = document.getElementById("tripList");
  const count = document.getElementById("tripCount");

  if (!box || !count) return;

  count.textContent =
    `${list.length} trip${list.length === 1 ? "" : "s"}`;

  box.innerHTML = list.length
    ? list.map(t => `
      <article class="card">
        <div class="route">📍 ${t.from} → ${t.to}</div>
        <div class="meta">📅 ${t.date} &nbsp; 🕐 ${t.time}</div>
        <div class="seats">
          💺 ${t.seats} seat${t.seats == 1 ? "" : "s"} available
        </div>
        ${t.fare ? `<div class="meta">💰 ₹${t.fare} / seat</div>` : ""}
        <a class="btn" href="${waLink(t)}" target="_blank">
          💬 Enquire / Book
        </a>
      </article>
    `).join("")
    : "<p>No matching trips found. Try another route.</p>";
}

function filterTrips() {
  const fromEl = document.getElementById("fromSearch");
  const toEl = document.getElementById("toSearch");

  if (!fromEl || !toEl) return;

  const f = fromEl.value.trim().toLowerCase();
  const t = toEl.value.trim().toLowerCase();

  renderTrips(
    getTrips().filter(x =>
      (!f || x.from.toLowerCase().includes(f)) &&
      (!t || x.to.toLowerCase().includes(t))
    )
  );
}

renderTrips();
