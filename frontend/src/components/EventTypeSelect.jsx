import { useEffect, useState } from "react";
import API from "../services/api";

export default function EventTypeSelect({ setEventType }) {
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    API.get("/event-types")
      .then(res => setTypes(res.data))
      .catch(err => console.error("EventType load error:", err));
  }, []);

  const handleChange = (e) => {
    setSelected(e.target.value);
    setEventType(e.target.value); // ✅ SEND ObjectId
  };

  return (
    <select value={selected} onChange={handleChange}>
      <option value="">-- Select Event Type --</option>

      {types.map(t => (
        <option key={t._id} value={t._id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
