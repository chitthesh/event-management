import { useState } from "react";
import API from "../services/api";

export default function ClientDecorationUpload({ onUpload }) {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!name || !price || !image) {
      return alert("All fields required");
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", name);
      form.append("price", price);
      form.append("image", image);

      await API.post("/decorations", form);

      alert("🎀 Decoration uploaded!");

      setName("");
      setPrice("");
      setImage(null);
      setPreview("");

      onUpload(); // 🔥 refresh decoration list

    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">

      <h3>🎀 Upload Your Decoration</h3>

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

      <input
        type="file"
        accept="image/*"
        onChange={e => {
          const file = e.target.files[0];
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          width="150"
          style={{ marginTop: 10 }}
        />
      )}

      <button onClick={upload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Decoration"}
      </button>

    </div>
  );
}
