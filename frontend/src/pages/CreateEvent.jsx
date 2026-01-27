import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import EventTypeSelect from "../components/EventTypeSelect";
import Catering from "./Catering";
import ItemSelect from "../components/ItemSelect";
import ClientDecorationUpload from "../components/ClientDecorationUpload";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState(100);
  const [cateringServices, setCateringServices] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dark, setDark] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [refreshDecor, setRefreshDecor] = useState(false); // 🔥 force reload
const [draftEventId, setDraftEventId] = useState(null);

  /* COST */
  const cateringCost = cateringServices.reduce(
    (sum, c) => sum + c.pricePerPlate * guests,
    0
  );

  const itemsCost = items.reduce(
    (sum, i) => sum + (i.price || 0),
    0
  );

  const totalCost = cateringCost + itemsCost;

  /* STEP 1 */
  const submit = () => {
    if (!eventType) return alert("Please select event type");
    if (!eventDate) return alert("Please select date");
    if (cateringServices.length === 0)
      return alert("Please select catering items");

    setShowModal(true);
  };

  /* STEP 2 */
  const confirmCreate = async () => {
  try {
    setLoading(true);

    const res = await API.post("/events/create", {
      eventType,
      guests,
      eventDate,
      cateringServices: cateringServices.map(c => c._id),
      items: items.map(i => i._id),
      totalCost
    });

    // 🔥 SAVE EVENT ID FOR CLIENT DECOR
    setDraftEventId(res.data._id);

    alert("🎉 Event Created!");
    navigate("/dashboard");

  } catch (error) {
    alert("Failed to create event");
  } finally {
    setLoading(false);
    setShowModal(false);
  }
};

  return (
    <div className={`create-wrapper ${dark ? "dark" : ""}`}>

      {/* HEADER */}
      <div className="create-header">
        <h1>Create Your Event</h1>

        <button
          className="dark-toggle"
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* PROGRESS */}
      <div className="progress-big">
        <div className={`circle ${eventType && "active"}`}>1</div>
        <span></span>

        <div className={`circle ${cateringServices.length && "active"}`}>2</div>
        <span></span>

        <div className={`circle ${items.length && "active"}`}>3</div>
      </div>

      {/* MAIN GRID */}
      <div className="create-grid">

        {/* LEFT */}
        <div>

          <div className="glass-card">
            <h3>Event Details</h3>

            <label>Event Type</label>
            <EventTypeSelect setEventType={setEventType} />

            <label>Guests</label>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />

            <label>Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
            />
          </div>

          <div className="glass-card">
            <h3>Catering</h3>
            <Catering
              guests={guests}
              setCateringServices={setCateringServices}
            />
          </div>

          {/* 🎀 DECORATION */}
          <div className="glass-card">
            <h3>Decorations</h3>

            {/* CLIENT CUSTOM UPLOAD */}
            <ClientDecorationUpload
  eventId={draftEventId}
  onUpload={() => setRefreshDecor(!refreshDecor)}
/>

            {/* ADMIN + CLIENT DECOR LIST */}
            <ItemSelect
              key={refreshDecor}
              setItems={setItems}
            />
          </div>

        </div>

        {/* SUMMARY */}
        <div className="summary-panel medium">

          <h3>Order Summary</h3>

          <p>Guests: <b>{guests}</b></p>
          <p>Catering: <b>₹{cateringCost}</b></p>
          <p>Decoration: <b>₹{itemsCost}</b></p>

          <hr />

          <Animated value={totalCost} />

          <button className="primary full" onClick={submit}>
            Create Event
          </button>

        </div>
      </div>

      {/* CONFIRM */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Confirm Event?</h3>
            <p>Total ₹{totalCost}</p>

            <button
              className="success"
              onClick={confirmCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Confirm"}
            </button>

            <button
              className="danger"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ANIMATED TOTAL */
function Animated({ value }) {
  const [num, setNum] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += Math.ceil(value / 30);
      if (i >= value) {
        i = value;
        clearInterval(interval);
      }
      setNum(i);
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return <h2>₹{num}</h2>;
}
