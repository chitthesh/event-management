import { useEffect, useState } from "react";
import API from "../services/api";

const BASE_MEAL_PRICE = 75;

export default function Catering({ guests, setCateringServices }) {

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [payasam, setPayasam] = useState("Rice Payasam");
  const [loading, setLoading] = useState(true);

  /* LOAD FOOD FROM DB (ADMIN ADDED ONLY) */
  useEffect(() => {
    API.get("/catering")
      .then(res => setItems(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  /* TOGGLE FOOD */
  const toggle = (item) => {

    let updated;

    if (selected.some(i => i._id === item._id)) {
      updated = selected.filter(i => i._id !== item._id);
    } else {
      updated = [...selected, item];
    }

    setSelected(updated);
    setCateringServices(updated); // send to parent
  };

  /* COST */
  const extrasCost = selected.reduce(
    (sum, i) => sum + i.pricePerPlate,
    0
  );

  const total =
    guests * (BASE_MEAL_PRICE + extrasCost);

  const filterByCategory = (cat) =>
    items.filter(i => i.category === cat);

  if (loading) return <p>Loading menu...</p>;

  return (
    <div>

      <h3>Catering Selection</h3>

      {/* BASE MEAL */}
      <div className="card">
        <h4>Base Meal (₹75 per person – mandatory)</h4>

        <ul>
          <li>Pickle</li>
          <li>Rice (Boiled / White)</li>
          <li>Daal</li>
          <li>Palya</li>
        </ul>

        <label>Choose Payasam</label>
        <select
          value={payasam}
          onChange={e => setPayasam(e.target.value)}
        >
          <option>Rice Payasam</option>
          <option>Vermicelli Payasam</option>
          <option>Moong Dal Payasam</option>
        </select>
      </div>

      {/* FOOD ITEMS */}
      {["starter", "main course", "dessert", "special"].map(cat => (
        <div key={cat}>

          <h4 style={{ marginTop: 20 }}>
            {cat.toUpperCase()}
          </h4>

          <div className="catering-grid">

            {filterByCategory(cat).map(i => (
              <div
                key={i._id}
                className={
                  "catering-card " +
                  (selected.some(s => s._id === i._id)
                    ? "selected"
                    : "")
                }
              >

                {i.image && (
                  <img
                    src={i.image}
                    alt={i.name}
                    onError={(e) =>
                      (e.target.style.display = "none")
                    }
                  />
                )}

                <h3>{i.name}</h3>

                <span className="price-badge">
                  ₹{i.pricePerPlate} / plate
                </span>

                <button
                  className={
                    selected.some(s => s._id === i._id)
                      ? "danger"
                      : "primary"
                  }
                  onClick={() => toggle(i)}
                >
                  {selected.some(s => s._id === i._id)
                    ? "Remove"
                    : "Add"}
                </button>

              </div>
            ))}

          </div>
        </div>
      ))}

      {/* TOTAL */}
      <div className="total-bar">

        <p>
          Base: ₹{BASE_MEAL_PRICE} × {guests} =
          ₹{BASE_MEAL_PRICE * guests}
        </p>

        <p>
          Extras: ₹{extrasCost} × {guests} =
          ₹{extrasCost * guests}
        </p>

        <hr />

        <h4>Total Catering Cost: ₹{total}</h4>

      </div>

    </div>
  );
}
