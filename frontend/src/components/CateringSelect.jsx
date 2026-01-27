import { useEffect, useState } from "react";
import API from "../services/api";

export default function CateringSelect({ setCatering }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    API.get("/catering").then(res => setList(res.data));
  }, []);

  return (
    <>
      {list.map(c => (
        <label key={c._id}>
          <input
            type="checkbox"
            onChange={e =>
              setCatering(prev =>
                e.target.checked
                  ? [...prev, c]
                  : prev.filter(x => x._id !== c._id)
              )
            }
          />
          {c.name} (₹{c.pricePerPlate})
        </label>
      ))}
    </>
  );
}
