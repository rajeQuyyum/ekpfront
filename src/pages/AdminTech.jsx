import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";

export default function AdminTech() {
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

  // Load Tech list
  const loadItems = async () => {
    try {
      const res = await api.get("/tech");
      setItems(res.data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadItems();

    socket.on("tech_added", loadItems);
    socket.on("tech_updated", loadItems);
    socket.on("tech_deleted", loadItems);

    return () => {
      socket.off("tech_added");
      socket.off("tech_updated");
      socket.off("tech_deleted");
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

    await api.post("/tech", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // reset fields
    setName("");
    setDescription("");
    setPhone("");
    setLocation("");
    setImage(null);
    setRating(0);

    alert("Tech item created");
  };

  // DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/tech/${id}`);
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

    await api.put(`/tech/${id}`, fd, {
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

  const wordCount = description.trim()
    ? description.trim().split(/\s+/).length
    : 0;

  return (
    <div className="p-6 bg-white rounded shadow w-full">
      <h2 className="font-bold text-xl mb-4">Tech Management</h2>

      {/* CREATE */}
      <div className="border p-4 rounded mb-6">
        <h3 className="font-semibold mb-3">Create New Tech</h3>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Tech Name (max 30 character)"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
         <p className="text-sm text-gray-500 text-right">
         {name.length} / 30
        </p>


        <textarea
          className="border p-2 w-full mb-2 rounded"
          placeholder="Description (max 50 character)"
          maxLength={50}
          rows="2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-sm text-gray-500 text-right">
         {description.length} / 50
        </p>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Phone Number (max 28 character)"
          maxLength={28}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="text-sm text-gray-500 text-right">
         {phone.length} / 28
        </p>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Location (max 25 character)"
          maxLength={25}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <p className="text-sm text-gray-500 text-right">
         {location.length} / 25
        </p>

        <input
        type="file"
        className="border p-2 w-full mb-2 rounded"
        accept="image/*"
        onChange={(e) => {
         const file = e.target.files[0];
         if (!file) return;

          const maxSize = 2 * 1024 * 1024; // ✅ 1MB
     
         if (file.size > maxSize) {
          alert("File size must be 2MB or less");
          e.target.value = ""; // reset input
          return;
         }

         setImage(file);
        }}
       />

        <h4 className="font-semibold mt-2">Rating</h4>
        <RatingButtons value={rating} setValue={setRating} />

        <button
          onClick={createItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Tech
        </button>
      </div>

      <hr className="my-6" />

      {/* LIST */}
      {items.map((item) => (
        <div key={item._id} className="border p-3 rounded mb-3 bg-gray-50">
          {editingId === item._id ? (
            <>
              {/* EDIT MODE */}
              <input
                className="border p-2 w-full mb-2 rounded"
                 placeholder="Tech Name (max 30 character)"
                 maxLength={30}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <p className="text-sm text-gray-500 text-right">
              {editName.length} / 30
              </p>


              <textarea
                className="border p-2 w-full mb-2 rounded"
                placeholder="Description (max 50 character)"
                 maxLength={30}
                rows="2"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <p className="text-sm text-gray-500 text-right">
              {editDescription.length} / 50
              </p>

              <input
                className="border p-2 w-full mb-2 rounded"
                placeholder="Phone Number (max 28 character)"
                maxLength={28}
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
              <p className="text-sm text-gray-500 text-right">
              {editPhone.length} / 28
              </p>


              <input
                className="border p-2 w-full mb-2 rounded"
                 placeholder="Location (max 25 character)"
                maxLength={25}
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
              <p className="text-sm text-gray-500 text-right">
              {editLocation.length} / 25
              </p>

              <input
        type="file"
        className="border p-2 w-full mb-2 rounded"
        accept="image/*"
        onChange={(e) => {
         const file = e.target.files[0];
         if (!file) return;

          const maxSize = 2 * 1024 * 1024; // ✅ 1MB
     
         if (file.size > maxSize) {
          alert("File size must be 2MB or less");
          e.target.value = ""; // reset input
          return;
         }

         setEditImage(file);
        }}
       />

              <img
                src={editImage ? URL.createObjectURL(editImage) : item.imageUrl}
                className="w-32 h-32 object-cover rounded mb-3"
                alt=""
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
              {/* NORMAL MODE */}
              <div className="font-semibold text-lg">{item.name}</div>

              <img
                src={item.imageUrl}
                className="w-32 h-32 object-cover mt-2 rounded"
                alt=""
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
