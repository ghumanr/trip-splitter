import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import api from "../services/api";

function CreateTripPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You need to log in first.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/trips", {
        title,
        description,
        destination,
        startDate,
        endDate,
        userId: user.id,
        members: members
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email !== ""),
      });

      navigate(`/trips/${response.data.id}`);
    } catch {
      setError("Could not create trip. Check that the server and database are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-dark rounded-[2.5rem] p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          New Trip
        </p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Create a travel group</h2>
        <p className="mt-3 text-slate-300">
          Add the basic details and invite travelers by email.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel-strong mt-6 space-y-5 rounded-[2rem] p-6"
      >
        {error ? (
          <div className="rounded-2xl border border-red-200/70 bg-red-50/80 p-3 text-sm font-semibold text-red-700 backdrop-blur">
            {error}
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">Trip Name</label>
          <input
            type="text"
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Miami Spring Break"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Destination</label>
            <input
              type="text"
              className="field"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Miami, FL"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Members by email
            </label>
            <input
              type="text"
              className="field"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="alex@email.com, sam@email.com"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Start Date</label>
            <input
              type="date"
              className="field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">End Date</label>
            <input
              type="date"
              className="field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
          <textarea
            className="field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Flights, lodging, meals, rideshares, and group activities."
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="primary-button w-full px-5 py-3"
        >
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}

export default CreateTripPage;