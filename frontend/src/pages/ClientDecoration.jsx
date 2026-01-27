import { useState } from "react";
import API from "../services/api";

export default function ClientDecorationUpload({ eventId, onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadClientDecor = async () => {
    if (!file) return alert("Select an image first");

    if (!eventId) {
      alert("Please create event first");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("image", file);
      form.append("eventId", eventId); // 🔥 LINK TO EVENT

      await API.post("/decorations", form);

      alert("Decoration sent to admin for approval");

      setFile(null);
      onUpload();

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 15 }}>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="primary mt-1"
        onClick={uploadClientDecor}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Custom Decoration"}
      </button>

      <small style={{ display: "block", marginTop: 5 }}>
        Admin will review & add price
      </small>

    </div>
  );
}
