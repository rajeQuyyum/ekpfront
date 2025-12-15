import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";

export default function AdminAdvert() {
  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editImage, setEditImage] = useState(null);

  const loadItems = async () => {
    try {
      const res = await api.get("/adverts");
      setItems(res.data.adverts || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadItems();

    socket.on("advert_added", loadItems);
    socket.on("advert_updated", loadItems);
    socket.on("advert_deleted", loadItems);

    return () => {
      socket.off("advert_added");
      socket.off("advert_updated");
      socket.off("advert_deleted");
    };
  }, []);

  const createItem = async () => {
    if (!name || !description) return alert("Enter all fields!");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("location", location);
    fd.append("phone", phone);
    if (image) fd.append("image", image);

    await api.post("/adverts", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setName("");
    setDescription("");
    setLocation("");
    setPhone("");
    setImage(null);

    alert("Advert created");
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this advert?")) return;
    await api.delete(`/adverts/${id}`);
  };

  const saveEdit = async (id) => {
    const fd = new FormData();
    fd.append("name", editName);
    fd.append("description", editDescription);
    fd.append("location", editLocation);
    fd.append("phone", editPhone);
    if (editImage) fd.append("image", editImage);

    await api.put(`/adverts/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setEditingId(null);
    alert("Updated!");
  };

  const wordCount = description.trim()
    ? description.trim().split(/\s+/).length
    : 0;

  return (
    <div className="p-6 bg-white rounded shadow w-full">
      <h2 className="font-bold text-xl mb-4">Advert Management</h2>

      {/* CREATE */}
      <div className="border p-4 rounded mb-6">
        <input
         className="border p-2 w-full mb-2 rounded"
         placeholder="Name (max 30 characters)"
         maxLength={30}
         value={name}
         onChange={(e) => setName(e.target.value)}
        />

        <p className="text-sm text-gray-500 text-right">
         {name.length} / 30
        </p>


        <textarea
         className="border p-2 w-full mb-1 rounded"
         placeholder="Description (max 50 characters)"
         rows="2"
         maxLength={50}
         value={description}
         onChange={(e) => setDescription(e.target.value)}
          />

        <p className="text-sm text-gray-500 text-right">
          {description.length} / 50 characters
          </p>

        <input className="border p-2 w-full mb-2 rounded" placeholder="Location (max 25 characters)"
        maxLength={25}
          value={location} onChange={(e) => setLocation(e.target.value)} />
          <p className="text-sm text-gray-500 text-right">
         {location.length} / 25
        </p>

        <input className="border p-2 w-full mb-2 rounded" placeholder="Phone (max 28 characters)"
        maxLength={28}
          value={phone} onChange={(e) => setPhone(e.target.value)} />
          <p className="text-sm text-gray-500 text-right">
         {phone.length} / 28
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


        <button onClick={createItem} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Advert
        </button>
      </div>

      {/* LIST */}
      {items.map((item) => (
        <div key={item._id} className="border p-3 rounded mb-3 bg-gray-50">

          {/* EDIT MODE */}
          {editingId === item._id ? (
            <>
              <input className="border p-2 w-full mb-2 rounded"
              placeholder="Name (max 30 characters)"
               maxLength={30}
                value={editName} onChange={(e) => setEditName(e.target.value)} />
                <p className="text-sm text-gray-500 text-right">
               {editName.length} / 30
              </p>


              <textarea className="border p-2 w-full mb-2 rounded"
              placeholder="Description (max 50 characters)"
               rows="2"
                maxLength={50}
                value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                 <p className="text-sm text-gray-500 text-right">
                 {editDescription.length} / 50 characters
                 </p>


              <input className="border p-2 w-full mb-2 rounded"
               placeholder="Location (max 25 characters)"
                maxLength={25}
                value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                <p className="text-sm text-gray-500 text-right">
                {editLocation.length} / 25
               </p>



              <input className="border p-2 w-full mb-2 rounded"
              placeholder="Phone (max 28 characters)"
               maxLength={28}
                value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                <p className="text-sm text-gray-500 text-right">
                {editPhone.length} / 25
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

              <img src={editImage ? URL.createObjectURL(editImage) : item.imageUrl}
                className="w-32 h-32 object-cover rounded mb-2" />

              <button onClick={() => saveEdit(item._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
              <button onClick={() => setEditingId(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded ml-2">Cancel</button>
            </>
          ) : (
            <>
              <div className="font-bold text-lg">{item.name}</div>
              <div>{item.description}</div>
              <div>📍 {item.location}</div>
              <div>📞 {item.phone}</div>

              {item.imageUrl && (
                <img src={item.imageUrl} className="w-32 h-32 object-cover rounded mt-2" />
              )}

              <button className="text-blue-600 mt-2"
                onClick={() => {
                  setEditingId(item._id);
                  setEditName(item.name);
                  setEditDescription(item.description);
                  setEditLocation(item.location);
                  setEditPhone(item.phone);
                }}>Edit</button>

              <button className="text-red-600 ml-3 mt-2"
                onClick={() => deleteItem(item._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

