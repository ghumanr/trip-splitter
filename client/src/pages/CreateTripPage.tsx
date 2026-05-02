import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateTripPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/trips", {
        title,
        description,
        createdById: "001", // TODO: Replace with actual user ID from auth context
        members: members
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email !== ""),
      });

      setTitle("");
      setDescription("");
      setMembers("");

      navigate("/");
    } catch (error) {
      console.error("Failed to create trip:", error);
      alert("Failed to create trip. Check the backend and createdById.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
      <h2 className="text-3xl font-bold mb-6">Create a New Trip</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Trip Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter trip name"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border rounded-lg px-4 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter trip description"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Members, comma separated
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            placeholder="alex@gmail.com, sam@gmail.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}

export default CreateTripPage;