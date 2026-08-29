const KEY = "mahakal_trips_v1";

const sample = [
  {
    id: "sample1",
    from: "Pune",
    to: "Ujjain",
    date: "2026-09-05",
    time: "05:00",
    seats: 7,
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


/* =========================
   OPEN BOOKING FORM
   ========================= */

function openBooking(trip) {

  const modal = document.getElementById("bookingModal");

  const from = document.getElementById("bookingFrom");
  const to = document.getElementById("bookingTo");
  const date = document.getElementById("bookingDate");
  const time = document.getElementById("bookingTime");
  const seats = document.getElementById("bookingSeats");

  from.innerHTML = `
    <option value="${trip.from}">
      ${trip.from}
    </option>
  `;

  to.innerHTML = `
    <option value="${trip.to}">
      ${trip.to}
    </option>
  `;

  date.value = trip.date;
  time.value = trip.time;

  seats.innerHTML = `
    <option value="">
      Select Seats
    </option>
  `;

  const maxSeats = Math.min(Number(trip.seats), 7);

  for (let i = 1; i <= maxSeats; i++) {

    seats.innerHTML += `
      <option value="${i}">
        ${i} ${i === 1 ? "Seat" : "Seats"}
      </option>
    `;

  }

  document.getElementById("bookingName").value = "";
  document.getElementById("bookingPhone").value = "";

  modal.style.display = "flex";
}


/* =========================
   CLOSE BOOKING FORM
   ========================= */

function closeBooking() {

  document.getElementById(
    "bookingModal"
  ).style.display = "none";

}


/* =========================
   SEND BOOKING ENQUIRY
   ========================= */

function sendBooking() {

  const name =
    document.getElementById(
      "bookingName"
    ).value.trim();

  const phone =
    document.getElementById(
      "bookingPhone"
    ).value.trim();

  const from =
    document.getElementById(
      "bookingFrom"
    ).value;

  const to =
    document.getElementById(
      "bookingTo"
    ).value;

  const date =
    document.getElementById(
      "bookingDate"
    ).value;

  const time =
    document.getElementById(
      "bookingTime"
    ).value;

  const seats =
    document.getElementById(
      "bookingSeats"
    ).value;


  /* VALIDATION */

  if (!name) {

    alert("Please enter passenger name.");

    return;

  }


  if (!/^[0-9]{10}$/.test(phone)) {

    alert(
      "Please enter a valid 10 digit mobile number."
    );

    return;

  }


  if (
    !from ||
    !to ||
    !date ||
    !time ||
    !seats
  ) {

    alert(
      "Please fill all booking details."
    );

    return;

  }


  /* SAVE BOOKING */

  const booking = {

    id: Date.now().toString(),

    name: name,

    phone: phone,

    from: from,

    to: to,

    date: date,

    time: time,

    seats: Number(seats),

    status: "Pending",

    createdAt: new Date().toISOString()

  };


  const bookings =
    JSON.parse(
      localStorage.getItem(
        "mahakal_bookings"
      ) || "[]"
    );


  bookings.push(booking);


  localStorage.setItem(
    "mahakal_bookings",
    JSON.stringify(bookings)
  );


  /* WHATSAPP MESSAGE */

  const message =
`Hello Mahakal Tour & Travel,

I want to book/enquire about a trip.

Passenger Name: ${name}
Mobile Number: ${phone}

Pickup: ${from}
Drop: ${to}
Date: ${date}
Time: ${time}
Passengers / Seats: ${seats}

Booking Status: Pending

Please confirm my booking.

Thank you.`;

  
  const url =
    "https://wa.me/919630783154?text=" +
    encodeURIComponent(message);


  window.open(
    url,
    "_blank"
  );

}


/* =========================
   DISPLAY TRIPS
   ========================= */

function renderTrips(list = getTrips()) {

  const box =
    document.getElementById(
      "tripList"
    );

  const count =
    document.getElementById(
      "tripCount"
    );


  if (!box || !count) return;


  count.textContent =
    `${list.length} trip${
      list.length === 1 ? "" : "s"
    }`;


  box.innerHTML = list.length

    ? list.map(t => `

      <article class="card">

        <div class="route">
          📍 ${t.from} → ${t.to}
        </div>

        <div class="meta">
          📅 ${t.date}
          &nbsp;
          🕐 ${t.time}
        </div>

        <div class="seats">
          💺 ${t.seats} seats available
        </div>

        ${
          t.fare
            ? `
              <div class="meta">
                💰 ₹${t.fare} / seat
              </div>
            `
            : ""
        }

        <button
          class="btn"
          onclick='openBooking(${JSON.stringify(t)})'
        >
          💬 Enquire / Book
        </button>

      </article>

    `).join("")

    : `
      <p>
        No matching trips found.
        Try another route.
      </p>
    `;

}


/* =========================
   SEARCH TRIPS
   ========================= */

function filterTrips() {

  const fromEl =
    document.getElementById(
      "fromSearch"
    );

  const toEl =
    document.getElementById(
      "toSearch"
    );


  if (!fromEl || !toEl) return;


  const f =
    fromEl.value
      .trim()
      .toLowerCase();

  const t =
    toEl.value
      .trim()
      .toLowerCase();


  renderTrips(

    getTrips().filter(x =>

      (!f ||
        x.from
          .toLowerCase()
          .includes(f))

      &&

      (!t ||
        x.to
          .toLowerCase()
          .includes(t))

    )

  );

}


/* =========================
   CLOSE MODAL OUTSIDE
   ========================= */

window.onclick = function(event) {

  const modal =
    document.getElementById(
      "bookingModal"
    );

  if (
    event.target === modal
  ) {

    closeBooking();

  }

};


/* =========================
   START
   ========================= */

renderTrips();
