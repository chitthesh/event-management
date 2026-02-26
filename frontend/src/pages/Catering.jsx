import { useEffect, useState } from "react";
import API from "../services/api";

const BASE_MEAL_PRICE = 75;

export default function Catering({ guests = 0, setCateringServices }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [payasam, setPayasam] = useState("Rice Payasam");
  const [loading, setLoading] = useState(true);
  const [foodType, setFoodType] = useState("all");

  /* =========================
     LOAD CATERING ITEMS
  ========================= */
  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await API.get("/catering");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Catering load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  /* =========================
     SYNC WITH PARENT
  ========================= */
  useEffect(() => {
    if (!setCateringServices) return;
    setCateringServices(selected);
  }, [selected, setCateringServices]);

  /* =========================
     TOGGLE ITEM
  ========================= */
  const toggle = (item) => {
    setSelected((prev) => {
      const exists = prev.some((i) => i._id === item._id);
      return exists
        ? prev.filter((i) => i._id !== item._id)
        : [...prev, item];
    });
  };

  /* =========================
     COST CALCULATION
  ========================= */
  const extrasCost = selected.reduce(
    (sum, i) => sum + (Number(i.pricePerPlate) || 0),
    0
  );

  const total = Number(guests) * (BASE_MEAL_PRICE + extrasCost);

  /* =========================
     FILTER FUNCTION
  ========================= */
  const filterByCategory = (cat) => {
    return items.filter((i) => {
      const category =
        cat === "main course" ? "main" : cat;

      const matchCategory =
        i.category?.toLowerCase() === category.toLowerCase();

      const matchType =
        foodType === "all" ||
        i.foodType?.toLowerCase() === foodType.toLowerCase();

      return matchCategory && matchType;
    });
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div>
      <h3>Catering Selection</h3>

      {/* BASE MEAL */}
      <div className="catering-card base-meal">
        <h4>Base Meal (Mandatory)</h4>

        <ul>
          <li>Pickle</li>
          <li>Rice (Boiled / White)</li>
          <li>Daal</li>
          <li>Palya</li>
        </ul>

        <label>Choose Payasam</label>
        <select
          value={payasam}
          onChange={(e) => setPayasam(e.target.value)}
        >
          <option>Rice Payasam</option>
          <option>Vermicelli Payasam</option>
          <option>Moong Dal Payasam</option>
        </select>

        <div className="price-badge locked">
          ₹{BASE_MEAL_PRICE} / plate
        </div>

        <button className="locked-btn" disabled>
          Included
        </button>
      </div>

      {/* FOOD FILTER */}
      <div className="food-filter">
        <button
          className={foodType === "all" ? "active" : ""}
          onClick={() => setFoodType("all")}
        >
          ALL
        </button>

        <button
          className={foodType === "veg" ? "active veg" : "veg"}
          onClick={() => setFoodType("veg")}
        >
          Veg
        </button>

        <button
          className={
            foodType === "non-veg" ? "active non-veg" : "non-veg"
          }
          onClick={() => setFoodType("non-veg")}
        >
          Non-Veg
        </button>
      </div>

      {/* FOOD BY CATEGORY */}
      {["starter", "main course","desert", "special"].map((cat) => (
        <div key={cat}>
          <h4 style={{ marginTop: 20 }}>{cat.toUpperCase()}</h4>

          <div className="catering-grid">
            {filterByCategory(cat).length === 0 && (
              <p>No items in this category</p>
            )}

            {filterByCategory(cat).map((i) => {
              const isSelected = selected.some(
                (s) => s._id === i._id
              );

              return (
                <div
                  key={i._id}
                  className={
                    "catering-card " +
                    (isSelected ? "selected" : "")
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
                      isSelected ? "danger" : "primary"
                    }
                    onClick={() => toggle(i)}
                  >
                    {isSelected ? "Remove" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* MINI SUMMARY */}
      <div className="mini-summary">
        <h4>🧾 Live Summary</h4>

        <p>
          <b>Guests:</b> {guests}
        </p>

        <p>
          <b>Base:</b> ₹{BASE_MEAL_PRICE} × {guests}
        </p>

        {selected.length > 0 && (
          <>
            <p>
              <b>Extras:</b>
            </p>
            <ul>
              {selected.map((i) => (
                <li key={i._id}>
                  {i.name} – ₹{i.pricePerPlate}
                </li>
              ))}
            </ul>
          </>
        )}

        <hr />

        <h3>Total: ₹{total}</h3>
      </div>
    </div>
  );
}