export default function CateringCard({
  item,
  selected,
  toggle
}) {
  return (
    <div className="card">
      <img
        src={item.image}
        alt={item.name}
        style={{ width: "100%", borderRadius: 6 }}
      />

      <h3>{item.name}</h3>
      <p>₹{item.pricePerPlate} / plate</p>

      <button
        className={selected ? "danger" : "primary"}
        onClick={() => toggle(item)}
      >
        {selected ? "Remove" : "Add"}
      </button>
    </div>
  );
}
