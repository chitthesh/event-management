import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminEventTypes() {
  const [name, setName] = useState("");
  const [types, setTypes] = useState([]);

  const loadTypes = async () => {
    const res = await API.get("/event-types");
    setTypes(res.data);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const addType = async () => {
    if (!name) {
      alert("Enter event type");
      return;
    }

    await API.post("/event-types", { name });
    setName("");
    loadTypes();
  };

  const deleteType = async (id) => {
    await API.delete(`/event-types/${id}`);
    loadTypes();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin – Event Types</h2>

      <input
        placeholder="Event Type"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addType}>Add</button>

      <ul>
        {types.map((t) => (
          <li key={t._id}>
            {t.name}
            <button onClick={() => deleteType(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
