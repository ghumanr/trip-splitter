import { Link } from "react-router-dom";
import type { Trip } from "../types";

type TripCardProps = {
  trip: Trip;
};

function TripCard({ trip }: TripCardProps) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition block"
    >
      <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
      <p className="text-gray-600 mb-3">{trip.description}</p>
      <p className="text-sm text-gray-500">
        {trip.members.length} members • {trip.expenses.length} expenses
      </p>
    </Link>
  );
}

export default TripCard;