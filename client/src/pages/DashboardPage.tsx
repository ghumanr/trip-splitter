import { useEffect, useState } from "react";
import TripCard from "../components/TripCard";
import api from "../services/api";
import type { Trip } from "../types";

function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips");
        console.log("Trips from backend:", response.data);
        setTrips(response.data);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <div>Loading trips...</div>;
  }

  return (
    <div>
      <h2>Your Trips</h2>
      <div>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;