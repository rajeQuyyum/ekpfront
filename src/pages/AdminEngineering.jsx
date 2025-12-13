import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";

export default function AdminEngineering() {
  const [items, setItems] = useState([]);

  // CREATE FIELDS
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState(0);

  // EDIT FIELDS
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editRating, setEditRating] = useState(0);

  const loadItems = async () => {
    try {
      const res = await api.get("/engineering");
      setItems(res.data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadItems();

    socket.on("engineering_added", loadItems);
    socket.on("engineering_updated", loadItems);
    socket.on("engineering_deleted", loadItems);

    return () => {
      socket.off("engineering_added");
      socket.off("engineering_updated");
      socket.off("engineering_deleted");
    };
  }, []);

  // CREATE ITEM
  const createItem = async () => {
    if (!name || !image) return alert("Enter name & image");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("phone", phone);
    fd.append("location", location);
    fd.append("image", image);
    fd.append("rating", rating);

    await api.post("/engineering", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setName("");
    setDescription("");
    setPhone("");
    setLocation("");
    setImage(null);
    setRating(0);

    alert("Engineering item created");
  };

  // DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/engineering/${id}`);
  };

  // SAVE EDIT
  const saveEdit = async (id) => {
    const fd = new FormData();
    fd.append("name", editName);
    fd.append("description", editDescription);
    fd.append("phone", editPhone);
    fd.append("location", editLocation);
    fd.append("rating", editRating);
    if (editImage) fd.append("image", editImage);

    await api.put(`/engineering/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setEditingId(null);
    setEditImage(null);
    alert("Updated!");
  };

  // ⭐ STAR BUTTONS
  const RatingButtons = ({ value, setValue }) => (
    <div className="flex gap-1 my-2">
      {[0, 1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setValue(star)}
          className={`px-2 py-1 rounded ${
            value === star ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {star} ⭐
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded shadow w-full">
      <h2 className="font-bold text-xl mb-4">Engineering Management</h2>

      {/* CREATE */}
      <div className="border p-4 rounded mb-6">
        <h3 className="font-semibold mb-3">Create New Engineering</h3>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Engineering Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2 rounded"
          placeholder="Description"
          rows="2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="file"
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <h4 className="font-semibold mt-2">Rating</h4>
        <RatingButtons value={rating} setValue={setRating} />

        <button
          onClick={createItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Engineering
        </button>
      </div>

      <hr className="my-6" />

      {/* LIST */}
      {items.map((item) => (
        <div key={item._id} className="border p-3 rounded mb-3 bg-gray-50">
          {editingId === item._id ? (
            <>
              <input
                className="border p-2 w-full mb-2 rounded"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <textarea
                className="border p-2 w-full mb-2 rounded"
                rows="2"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <input
                className="border p-2 w-full mb-2 rounded"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />

              <input
                className="border p-2 w-full mb-2 rounded"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />

              <input
                type="file"
                className="border p-2 w-full mb-2 rounded"
                onChange={(e) => setEditImage(e.target.files[0])}
              />

              <img
                src={editImage ? URL.createObjectURL(editImage) : item.imageUrl}
                className="w-32 h-32 object-cover rounded mb-3"
              />

              <h4 className="font-semibold mt-2">Rating</h4>
              <RatingButtons value={editRating} setValue={setEditRating} />

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => saveEdit(item._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold text-lg">{item.name}</div>

              <img
                src={item.imageUrl}
                className="w-32 h-32 object-cover mt-2 rounded"
              />

              <p className="mt-2">{item.description}</p>
              <p>📞 {item.phone}</p>
              <p>📍 {item.location}</p>

              <div className="mt-2">
                <strong>Rating:</strong> {item.rating} ⭐
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setEditingId(item._id);
                    setEditName(item.name);
                    setEditDescription(item.description);
                    setEditPhone(item.phone);
                    setEditLocation(item.location);
                    setEditRating(item.rating);
                  }}
                >
                  Edit
                </button>

                <button
                  className="text-red-600"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
