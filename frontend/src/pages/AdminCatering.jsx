import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminCatering() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "starter",
    pricePerPlate: "",
    image: ""
  });

  /* =======================
     LOAD FOOD
  ======================= */
  const load = async () => {
    const res = await API.get("/catering");
    setFoods(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* =======================
     ADD FOOD
  ======================= */
  const submit = async () => {
    if (!form.name || !form.pricePerPlate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/catering", form);
      alert("Food item added successfully");

      setForm({
        name: "",
        category: "starter",
        pricePerPlate: "",
        image: ""
      });

      load();
    } catch (err) {
      alert("Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     DELETE FOOD
  ======================= */
  const remove = async (id) => {
    if (!window.confirm("Delete this food item?")) return;

    await API.delete(`/catering/${id}`);
    load();
  };

  return (
    <div className="container">
      <h2>Admin Catering Control</h2>

      {/* ➕ ADD FOOD */}
      <div className="card">
        <h3>Add New Food</h3>

        <input
          placeholder="Food Name"
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <select
          value={form.category}
          onChange={e =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="starter">Starter</option>
          <option value="main">Main</option>
          <option value="dessert">Dessert</option>
          <option value="special">Special</option>
        </select>

        <input
          type="number"
          placeholder="Price / plate"
          value={form.pricePerPlate}
          onChange={e =>
            setForm({
              ...form,
              pricePerPlate: e.target.value
            })
          }
        />

        <input
          placeholder="Image URL"
          value={form.image}
          onChange={e =>
            setForm({ ...form, image: e.target.value })
          }
        />

        {form.image && (
          <img
            src={form.image}
            alt="preview"
            style={{
              width: 150,
              marginTop: 10,
              borderRadius: 6
            }}
          />
        )}

        <button
          className="primary"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Food"}
        </button>
      </div>

      <hr />

      {/* 📋 FOOD LIST */}
      <div className="catering-grid">
        {foods.map(f => (
          <div key={f._id} className="catering-card">
            {f.image && (
              <img src={f.image} alt={f.name} />
            )}

            <h4>{f.name}</h4>
            <p>{f.category}</p>
            <p>₹{f.pricePerPlate}/plate</p>

            <button
              className="danger"
              onClick={() => remove(f._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
