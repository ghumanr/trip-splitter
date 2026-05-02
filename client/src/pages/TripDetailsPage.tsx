import { useParams } from "react-router-dom";
import BalanceSummary from "../components/BalanceSummary";
import ExpenseList from "../components/ExpenseList";
import { trips } from "../data/mockData";

function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();

  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return <div className="text-red-500">Trip not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-3xl font-bold">{trip.title}</h2>
        <p className="text-gray-600 mt-2">{trip.description}</p>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Members</h3>
          <div className="flex gap-2 flex-wrap">
            {trip.members.map((member) => (
              <span
                key={member}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      </div>

      <BalanceSummary balances={trip.balances} />
      <ExpenseList expenses={trip.expenses} />
    </div>
  );
}

export default TripDetailsPage;