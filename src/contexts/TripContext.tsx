import { createContext, useContext, useReducer, useEffect } from "react";

export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  customSplits?: { [personId: string]: number };
  date: Date;
}

export interface Trip {
  id: string;
  name: string;
  people: Person[];
  expenses: Expense[];
  createdAt: Date;
}

type TripState = {
  trips: Trip[];
  currentTrip: Trip | null;
};

type TripAction =
  | { type: "SET_TRIPS"; payload: Trip[] }
  | { type: "ADD_TRIP"; payload: Trip }
  | { type: "SET_CURRENT_TRIP"; payload: Trip | null }
  | { type: "UPDATE_TRIP"; payload: Trip }
  | { type: "ADD_PERSON"; payload: { tripId: string; person: Person } }
  | { type: "REMOVE_PERSON"; payload: { tripId: string; personId: string } }
  | { type: "ADD_EXPENSE"; payload: { tripId: string; expense: Expense } }
  | { type: "UPDATE_EXPENSE"; payload: { tripId: string; expense: Expense } }
  | { type: "DELETE_EXPENSE"; payload: { tripId: string; expenseId: string } };

const initialState: TripState = {
  trips: [],
  currentTrip: null,
};

function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case "SET_TRIPS":
      return { ...state, trips: action.payload };
    
    case "ADD_TRIP":
      return { ...state, trips: [...state.trips, action.payload] };
    
    case "SET_CURRENT_TRIP":
      return { ...state, currentTrip: action.payload };
    
    case "UPDATE_TRIP":
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.id === action.payload.id ? action.payload : trip
        ),
        currentTrip: state.currentTrip?.id === action.payload.id ? action.payload : state.currentTrip,
      };
    
    case "ADD_PERSON":
      const updatedTripsWithPerson = state.trips.map(trip =>
        trip.id === action.payload.tripId
          ? { ...trip, people: [...trip.people, action.payload.person] }
          : trip
      );
      return {
        ...state,
        trips: updatedTripsWithPerson,
        currentTrip: state.currentTrip?.id === action.payload.tripId
          ? { ...state.currentTrip, people: [...state.currentTrip.people, action.payload.person] }
          : state.currentTrip,
      };
    
    case "REMOVE_PERSON":
      const updatedTripsWithoutPerson = state.trips.map(trip =>
        trip.id === action.payload.tripId
          ? {
              ...trip,
              people: trip.people.filter(p => p.id !== action.payload.personId),
              expenses: trip.expenses.filter(e => 
                e.paidBy !== action.payload.personId &&
                !e.splitAmong.includes(action.payload.personId)
              )
            }
          : trip
      );
      return {
        ...state,
        trips: updatedTripsWithoutPerson,
        currentTrip: state.currentTrip?.id === action.payload.tripId
          ? updatedTripsWithoutPerson.find(t => t.id === action.payload.tripId) || null
          : state.currentTrip,
      };
    
    case "ADD_EXPENSE":
      const updatedTripsWithExpense = state.trips.map(trip =>
        trip.id === action.payload.tripId
          ? { ...trip, expenses: [...trip.expenses, action.payload.expense] }
          : trip
      );
      return {
        ...state,
        trips: updatedTripsWithExpense,
        currentTrip: state.currentTrip?.id === action.payload.tripId
          ? { ...state.currentTrip, expenses: [...state.currentTrip.expenses, action.payload.expense] }
          : state.currentTrip,
      };
    
    case "UPDATE_EXPENSE":
      const updatedTripsWithUpdatedExpense = state.trips.map(trip =>
        trip.id === action.payload.tripId
          ? {
              ...trip,
              expenses: trip.expenses.map(e =>
                e.id === action.payload.expense.id ? action.payload.expense : e
              )
            }
          : trip
      );
      return {
        ...state,
        trips: updatedTripsWithUpdatedExpense,
        currentTrip: state.currentTrip?.id === action.payload.tripId
          ? {
              ...state.currentTrip,
              expenses: state.currentTrip.expenses.map(e =>
                e.id === action.payload.expense.id ? action.payload.expense : e
              )
            }
          : state.currentTrip,
      };
    
    case "DELETE_EXPENSE":
      const updatedTripsWithoutExpense = state.trips.map(trip =>
        trip.id === action.payload.tripId
          ? { ...trip, expenses: trip.expenses.filter(e => e.id !== action.payload.expenseId) }
          : trip
      );
      return {
        ...state,
        trips: updatedTripsWithoutExpense,
        currentTrip: state.currentTrip?.id === action.payload.tripId
          ? { ...state.currentTrip, expenses: state.currentTrip.expenses.filter(e => e.id !== action.payload.expenseId) }
          : state.currentTrip,
      };
    
    default:
      return state;
  }
}

const TripContext = createContext<{
  state: TripState;
  dispatch: React.Dispatch<TripAction>;
} | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  // Load trips from localStorage on mount
  useEffect(() => {
    const savedTrips = localStorage.getItem("expense-split-trips");
    if (savedTrips) {
      try {
        const parsedTrips = JSON.parse(savedTrips).map((trip: any) => ({
          ...trip,
          createdAt: new Date(trip.createdAt),
          expenses: trip.expenses.map((expense: any) => ({
            ...expense,
            date: new Date(expense.date),
          })),
        }));
        dispatch({ type: "SET_TRIPS", payload: parsedTrips });
      } catch (error) {
        console.error("Error loading trips from localStorage:", error);
      }
    }
  }, []);

  // Save trips to localStorage whenever trips change
  useEffect(() => {
    localStorage.setItem("expense-split-trips", JSON.stringify(state.trips));
  }, [state.trips]);

  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
}

// Helper functions for calculations
export function calculateBalances(trip: Trip) {
  const balances: { [personId: string]: number } = {};
  
  // Initialize balances
  trip.people.forEach(person => {
    balances[person.id] = 0;
  });

  // Calculate what each person paid and owes
  trip.expenses.forEach(expense => {
    // Person who paid gets credited
    balances[expense.paidBy] += expense.amount;
    
    // Calculate splits
    if (expense.customSplits) {
      // Custom split amounts
      Object.entries(expense.customSplits).forEach(([personId, amount]) => {
        balances[personId] -= amount;
      });
    } else {
      // Equal split among selected people
      const splitAmount = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach(personId => {
        balances[personId] -= splitAmount;
      });
    }
  });

  return balances;
}

export function calculateSettlements(trip: Trip) {
  const balances = calculateBalances(trip);
  const settlements: { from: string; to: string; amount: number }[] = [];
  
  // Get people who owe money (negative balance) and who are owed money (positive balance)
  const debtors = Object.entries(balances).filter(([_, amount]) => amount < 0);
  const creditors = Object.entries(balances).filter(([_, amount]) => amount > 0);
  
  // Sort by absolute amount
  debtors.sort((a, b) => a[1] - b[1]); // Most negative first
  creditors.sort((a, b) => b[1] - a[1]); // Most positive first
  
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const [debtorId, debtAmount] = debtors[i];
    const [creditorId, creditAmount] = creditors[j];
    
    const settlementAmount = Math.min(-debtAmount, creditAmount);
    
    if (settlementAmount > 0.01) { // Avoid tiny amounts due to floating point
      settlements.push({
        from: debtorId,
        to: creditorId,
        amount: Math.round(settlementAmount * 100) / 100
      });
    }
    
    // Update balances
    debtors[i][1] += settlementAmount;
    creditors[j][1] -= settlementAmount;
    
    // Move to next debtor/creditor if current one is settled
    if (Math.abs(debtors[i][1]) < 0.01) i++;
    if (Math.abs(creditors[j][1]) < 0.01) j++;
  }
  
  return settlements;
}