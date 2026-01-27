import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/decorations";

export default function AdminDecorations() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  /* LOAD DECORATIONS */
  useEffect(() => {
    fetchDecorations();

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [page]);

  const fetchDecorations = async () => {
    try {
      const res = await axios.get(
        `${API_URL}?page=${page}`
      );

      /* PAGINATION RESPONSE */
      if (Array.isArray(res.data.data)) {
        setList(res.data.data);
        setPages(res.data.pages || 1);
      } else {
        setList([]);
        console.error("Unexpected format:", res.data);
      }

    } catch (err) {
      console.error(err);
      setList([]);
    }
  };

  /* UPLOAD */
  const submit = async () => {
    if (!name || !price) {
      return alert("Name and price required");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (image) formData.append("image", image);

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("✅ Uploaded successfully");

      setName("");
      setPrice("");
      setImage(null);
      setPreview("");

      fetchDecorations();

    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* DELETE */
  const remove = async (id) => {
    if (!window.confirm("Delete decoration?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchDecorations();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-form">

      <h2>🎀 Add Decoration</h2>

      <input
        placeholder="Decoration Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      {/* IMAGE PICKER */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }}
      />

      {/* PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          width="150"
          style={{ marginTop: "10px" }}
        />
      )}

      <button onClick={submit} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      <hr />

      <h3>All Decorations</h3>

      {list.length === 0 && (
        <p>No decorations found</p>
      )}

      <div className="catering-grid">
        {list.map(d => (
          <div key={d._id} className="catering-card">

            {d.image && (
              <img
                src={`http://localhost:5000${d.image}`}
                alt={d.name}
              />
            )}

            <h4>{d.name}</h4>
            <p>₹{d.price}</p>

            <button
              className="danger"
              onClick={() => remove(d._id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div style={{ marginTop: 20 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            ◀ Prev
          </button>

          <span style={{ margin: "0 10px" }}>
            Page {page} of {pages}
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
