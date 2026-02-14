import API from "../services/api";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


export default function AdminDashboard() {

  const [analytics, setAnalytics] = useState({});
  const [events, setEvents] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  /* LOAD DATA */
  const loadData = async () => {
    try {
      setLoading(true);

      const analyticsRes = await API.get("/admin/analytics");
      const eventsRes = await API.get("/events/admin/all");

      /* SORT BY DATE */
      const sorted = [...eventsRes.data].sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );

      /* UNREAD FIRST */
      const unreadFirst = sorted.sort(
        (a, b) => (b.unread === true) - (a.unread === true)
      );

      setAnalytics(analyticsRes.data || {});
      setEvents(unreadFirst || []);

      buildChart(unreadFirst);

    } catch (error) {
      console.error("ADMIN LOAD ERROR:", error);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  /* BUILD CHART */
  const buildChart = (data) => {
    const map = {};

    data.forEach(e => {
      if (e.status !== "Completed") return;

      const month = new Date(e.eventDate)
        .toLocaleString("default", { month: "short" });

      if (!map[month]) {
        map[month] = {
          month,
          revenue: 0,
          bookings: 0
        };
      }

      map[month].revenue += e.totalCost;
      map[month].bookings += 1;
    });

    setChartData(Object.values(map));
  };

  /* UPDATE STATUS */
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/events/status/${id}`, { status });
      loadData();
    } catch {
      alert("Status update failed");
    }
  };

  /* MARK READ */
  const markRead = async (id) => {
    try {
      await API.put(`/events/read/${id}`);
      loadData();
    } catch {
      alert("Failed to mark read");
    }
  };

  if (loading) return <p>Loading admin dashboard...</p>;

  /* HIDE REJECTED */
  const filtered = events.filter(
    (e) => e.status !== "Rejected"
  );

  /* DAILY FILTER */
  const eventsOnDate = filtered.filter(e => {
    const d = new Date(e.eventDate);
    return d.toDateString() === date.toDateString();
  });

  /* MONTHLY FILTER */
  const monthlyEvents = filtered.filter(e => {
    const d = new Date(e.eventDate);
    return (
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="container">

      <h2>Admin Dashboard</h2>

      {/* ANALYTICS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Events</h4>
          <p>{analytics.totalEvents ?? 0}</p>
        </div>

        <div className="stat-card">
          <h4>Completed</h4>
          <p>{analytics.completedEvents ?? 0}</p>
        </div>

        <div className="stat-card">
          <h4>Total Users</h4>
          <p>{analytics.users ?? 0}</p>
        </div>

        <div className="stat-card">
          <h4>Revenue</h4>
          <p>₹{analytics.revenue ?? 0}</p>
        </div>
      </div>

      {/* <hr />

      {/* CHART */}
      {/* <h3>📊 Monthly Revenue & Bookings</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" />
          <Bar dataKey="bookings" />
        </BarChart>
      </ResponsiveContainer>

      <hr /> */ }

      {/* UNREAD */}
      <div className="unread-panel">
        <h3>Unread Events</h3>

        {events.filter(e => e.unread).length === 0 && (
          <p>No new events 🎉</p>
        )}

        {events.filter(e => e.unread).map(e => (
          <div
            key={e._id}
            className="unread-card"
            onClick={() => markRead(e._id)}
          >
            <p><b>{e.eventType?.name}</b></p>
            <p>{e.userId?.name}</p>
            <small>Tap to mark read</small>
          </div>
        ))}
      </div>

      {/* CALENDAR */}
      <div className="calendar-box">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={({ date }) => {
            const hasEvent = events.some(e => {
              const d = new Date(e.eventDate);
              return d.toDateString() === date.toDateString();
            });

            return hasEvent ? (
              <div className="dot"></div>
            ) : null;
          }}
        />
      </div>

      {/* MONTHLY VIEW */}
      <h3>
        Bookings in{" "}
        {date.toLocaleString("default", { month: "long" })}{" "}
        {date.getFullYear()}
      </h3>

      {monthlyEvents.map(e => (
        <div key={e._id} className="card">
          <p><b>Event:</b> {e.eventType?.name}</p>
          <p><b>Date:</b> {new Date(e.eventDate).toDateString()}</p>
          <p><b>Client:</b> {e.userId?.name}</p>
          <p>
            <b>Status:</b>{" "}
            <span className={`badge ${e.status.toLowerCase()}`}>
              {e.status}
            </span>
          </p>
        </div>
      ))}

      <hr />

      {/* DAILY VIEW */}
      <h3>Events on {date.toDateString()}</h3>

      {eventsOnDate.length === 0 && (
        <p>No events on this day</p>
      )}

      {eventsOnDate.map((e) => (

        <div
          key={e._id}
          className={`card event-card ${e.unread ? "unread" : ""}`}
          onClick={() => markRead(e._id)}
        >

          {e.unread && (
            <span className="unread-badge">NEW</span>
          )}

          <p><b>Event:</b> {e.eventType?.name}</p>
          <p><b>Date:</b> {new Date(e.eventDate).toDateString()}</p>
          <p>
            <b>Client:</b>{" "}
            {e.userId?.name} ({e.userId?.email})
          </p>

          <p><b>Guests:</b> {e.guests}</p>
          <p><b>Total:</b> ₹{e.totalCost}</p>

          <p>
            <b>Status:</b>{" "}
            <span className={`badge ${e.status.toLowerCase()}`}>
              {e.status}
            </span>
          </p>

          {/* FOOD */}
          <div style={{ marginTop: 10 }}>
            <b>Selected Food:</b>

            {e.cateringServices?.length > 0 ? (
              <div className="catering-grid">
                {e.cateringServices.map(food => (
                  <div
                    key={food._id}
                    className="catering-card selected"
                  >
                    <h4>{food.name}</h4>
                    <p>₹{food.pricePerPlate}/plate</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No catering selected</p>
            )}
          </div>

          {/* 🎀 DECORATIONS */}
         {/* 🎀 DECORATIONS */}
<div style={{ marginTop: 10 }}>
  <b>Selected Decorations:</b>

  {e.items?.length > 0 ? (
    <div className="catering-grid">
      {e.items.map(d => (
        <div
          key={d._id}
          className="catering-card selected"
        >
          {d.image && (
            <img
              src={`http://localhost:5000${d.image}`}
              alt={d.name}
            />
          )}

          <h4>{d.name}</h4>
         {d.price === null && (
  <input
    placeholder="Set price"
    onBlur={e =>
      API.put(`/decorations/price/${d._id}`, {
        price: e.target.value
      }).then(loadData)
    }
  />
)}

{d.price && <p>₹{d.price}</p>}

        </div>
      ))}
    </div>
  ) : (
    <p>No decoration selected</p>
  )}
</div>


          {/* ACTIONS */}
          <div className="btn-group">

            {e.status === "Pending" && (
              <>
                <button
                  className="success"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    updateStatus(e._id, "Approved");
                  }}
                >
                  Approve
                </button>

                <button
                  className="danger"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    updateStatus(e._id, "Rejected");
                  }}
                >
                  Reject
                </button>
              </>
            )}

            {e.status === "Approved" && (
              <button
                className="primary"
                onClick={(ev) => {
                  ev.stopPropagation();
                  updateStatus(e._id, "Completed");
                }}
              >
                Mark Completed
              </button>
            )}

            {e.status === "Cancelled" && (
              <p style={{ color:"#f59e0b", fontWeight:"bold" }}>
                ⚠ Client Cancelled
              </p>
            )}

          </div>

        </div>
      ))}
    </div>
  );
}