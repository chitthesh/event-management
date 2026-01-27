import API from "../services/api";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const shown = useRef({});

  const loadEvents = async () => {
    try {
      if (!user?.id) return;

      const res = await API.get(`/events/${user.id}`);
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* AUTO REFRESH */
  useEffect(() => {
    loadEvents();
    const timer = setInterval(loadEvents, 5000);
    return () => clearInterval(timer);
  }, []);

  /* NOTIFICATIONS */
  useEffect(() => {
    if (events.length === 0) return;

    const lastTwo = events
      .filter(e => e.message)
      .slice(-2);

    lastTwo.forEach(e => {
      if (!shown.current[e._id]) {
        shown.current[e._id] = 1;
        toast.info(e.message);
      } else if (shown.current[e._id] === 1) {
        shown.current[e._id] = 2;
        toast.info(e.message);
      }
    });
  }, [events]);

  /* CANCEL EVENT */
  const cancelEvent = async (id) => {
    if (!window.confirm("Cancel this event?")) return;

    try {
      await API.put(`/events/cancel/${id}`);
      toast.error("Event cancelled");
      loadEvents();
    } catch {
      toast.error("Cancel failed");
    }
  };

  return (
    <div className="container">
      <h2>My Events</h2>

      {loading && <p>Loading events...</p>}

      {!loading && events.length === 0 && (
        <div className="card empty">
          <h3>No events yet</h3>
          <p>Create an event to see updates here.</p>
        </div>
      )}

      {events.map((e) => (
        <div key={e._id} className="card event-card">

          {/* MESSAGE */}
          {e.message && (
            <div className="notification">
              {e.message}
            </div>
          )}

          <p><b>Event Type:</b> {e.eventType?.name}</p>

          <p>
            <b>Date:</b>{" "}
            {new Date(e.eventDate).toDateString()}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span
              className={`status-pill ${e.status.toLowerCase()}`}
            >
              {e.status}
            </span>
          </p>

          <p>
            <b>Total Cost:</b> ₹{e.totalCost}
          </p>

          {/* 🍽 FOOD */}
          <div style={{ marginTop: 10 }}>
            <b>Selected Food:</b>

            {e.cateringServices?.length > 0 ? (
              <ul>
                {e.cateringServices.map(f => (
                  <li key={f._id}>
                    {f.name} – ₹{f.pricePerPlate}/plate
                  </li>
                ))}
              </ul>
            ) : (
              <p>No food selected</p>
            )}
          </div>

          {/* 🎀 ADMIN DECORATIONS */}
          <div style={{ marginTop: 10 }}>
            <b>Selected Decorations:</b>

            {e.items?.length > 0 ? (
              <div className="catering-grid">
                {e.items.map(item => (
                  <div
                    key={item._id}
                    className="catering-card selected"
                  >
                    {item.image && (
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                      />
                    )}
                    <h4>{item.name}</h4>
                    {item.price ? (
  <p>₹{item.price}</p>
) : (
  <small style={{color:"orange"}}>
    Pending admin approval
  </small>
)}

                  </div>
                ))}
              </div>
            ) : (
              <p>No admin decoration selected</p>
            )}
          </div>

          {/* 🔥 CLIENT UPLOADED DECORATIONS */}
          <div style={{ marginTop: 10 }}>
            <b>Custom Decorations (Requested):</b>

            {e.clientDecorations?.length > 0 ? (
              <ul>
                {e.clientDecorations.map(d => (
                  <li key={d._id}>
                    <b>{d.name}</b> —{" "}
                    <span
                      style={{
                        color:
                          d.status === "Approved"
                            ? "green"
                            : d.status === "Rejected"
                            ? "red"
                            : "#f59e0b"
                      }}
                    >
                      {d.status}
                    </span>
                    {d.price && ` (₹${d.price})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No custom decorations uploaded</p>
            )}
          </div>

          {/* ❌ CANCEL */}
          {["Pending", "Approved"].includes(e.status) && (
            <button
              className="danger mt-2"
              onClick={() => cancelEvent(e._id)}
            >
              Cancel Event
            </button>
          )}

        </div>
      ))}
    </div>
  );
}
