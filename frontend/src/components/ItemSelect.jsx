import { useEffect, useState } from "react";
import API from "../services/api";

export default function ItemSelect({ setItems }) {

  const [items, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  /* 🔄 LOAD DECORATIONS */
  const loadDecorations = async (p = 1) => {
    try {
      setLoading(true);

      const res = await API.get(`/decorations?page=${p}`);

      // ✅ API RETURNS { data, total, pages }
      if (Array.isArray(res.data.data)) {
        setList(res.data.data);
        setPages(res.data.pages || 1);
      } else {
        console.error("Not array:", res.data);
        setList([]);
      }

    } catch (err) {
      console.error("Load decorations failed", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecorations(page);
  }, [page]);

  /* 🎯 SELECT / DESELECT */
  const toggleSelect = (item) => {

    let updated;

    if (selected.some(i => i._id === item._id)) {
      updated = selected.filter(i => i._id !== item._id);
    } else {
      updated = [...selected, item];
    }

    setSelected(updated);
    setItems(updated); // 🔥 sync with CreateEvent
  };

  return (
    <div>

      {/* LOADING */}
      {loading && <p>Loading decorations...</p>}

      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <p>No decorations found</p>
      )}

      {/* GRID */}
      <div className="catering-grid">
        {items.map(i => (

          <div
            key={i._id}
            className={
              "catering-card " +
              (selected.some(x => x._id === i._id)
                ? "selected"
                : "")
            }
            onClick={() => toggleSelect(i)}
          >

            {/* IMAGE */}
            {i.image ? (
              <img
                src={`http://localhost:5000${i.image}`}
                alt={i.name}
              />
            ) : (
              <div className="no-image">No Image</div>
            )}

            <h4>{i.name}</h4>
            <p>₹{i.price}</p>

            <small>
              {i.createdBy === "admin"
                ? "Admin Decor"
                : "Client Decor"}
            </small>

          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            ◀ Prev
          </button>

          <span>
            Page {page} / {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(p => p + 1)}
          >
            Next ▶
          </button>

        </div>
      )}

    </div>
  );
}
