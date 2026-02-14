import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import EventTypeSelect from "../components/EventTypeSelect";
import Catering from "./Catering";
import ItemSelect from "../components/ItemSelect";
import ClientDecorationUpload from "../components/ClientDecorationUpload";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const BASE_MEAL_PRICE = 75;

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
  const [refreshDecor, setRefreshDecor] = useState(false);
  const [draftEventId, setDraftEventId] = useState(null);

  /* =========================
     COST CALCULATION
  ========================= */

  const cateringCost =
    guests * BASE_MEAL_PRICE +
    cateringServices.reduce(
      (sum, c) => sum + (c.pricePerPlate || 0) * guests,
      0
    );

  const itemsCost = items.reduce(
    (sum, i) => sum + (i.price || 0),
    0
  );

  const totalCost = cateringCost + itemsCost;

  /* =========================
     VALIDATION
  ========================= */

  const submit = () => {
    if (!eventType) return alert("Please select event type");
    if (!eventDate) return alert("Please select date");
    if (guests <= 0) return alert("Guests must be more than 0");
    if (cateringServices.length === 0)
      return alert("Please select catering items");

    setShowModal(true);
  };

  /* =========================
     CONFIRM EVENT
  ========================= */

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

      setDraftEventId(res.data._id);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (error) {
      console.error(error);
      alert("Failed to create event");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  /* =========================
     DARK MODE
  ========================= */

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  return (
    <motion.div
      className="create-wrapper"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >

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

      {/* PROGRESS BAR */}
      <div className="progress-big">
        <div className={`circle ${eventType && "active"}`}>1</div>
        <span></span>

        <div className={`circle ${cateringServices.length > 0 && "active"}`}>2</div>
        <span></span>

        <div className={`circle ${items.length > 0 && "active"}`}>3</div>
      </div>

      {/* MAIN GRID */}
      <div className="create-grid">

        <div>

          {/* EVENT DETAILS */}
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

          {/* CATERING */}
          <div className="glass-card">
            <h3>Catering</h3>
            <Catering
              guests={guests}
              setCateringServices={setCateringServices}
            />
          </div>

          {/* DECORATIONS */}
          <div className="glass-card">
            <h3>Decorations</h3>

            <ClientDecorationUpload
              eventId={draftEventId}
              onUpload={() => setRefreshDecor(!refreshDecor)}
            />

            <ItemSelect
              key={refreshDecor}
              setItems={setItems}
            />
          </div>

        </div>

        {/* SUMMARY PANEL */}
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

      {/* CONFIRM MODAL */}
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

    </motion.div>
  );
}

/* =========================
   ANIMATED TOTAL
========================= */

function Animated({ value }) {
  const [num, setNum] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += Math.ceil(value / 30);

      if (current >= value) {
        current = value;
        clearInterval(interval);
      }

      setNum(current);
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return <h2>₹{num}</h2>;
}
