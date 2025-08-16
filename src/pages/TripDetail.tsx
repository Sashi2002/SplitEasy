import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { ExpenseList } from "@/components/ExpenseList";
import { useTrips } from "@/contexts/TripContext";
import { Calculator, Plus, ArrowLeft, Users, Receipt, IndianRupee } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useTrips();
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const currentTrip = state.trips.find(trip => trip.id === tripId);

  useEffect(() => {
    if (currentTrip) {
      dispatch({ type: "SET_CURRENT_TRIP", payload: currentTrip });
    }
  }, [currentTrip, dispatch]);

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
          <Button onClick={() => navigate('/trips')}>
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const totalExpenses = currentTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/trips')}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">{currentTrip.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {currentTrip.people.length} people • ₹{totalExpenses.toFixed(2)} total
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AddExpenseModal
              trip={currentTrip}
              isOpen={isAddingExpense}
              onOpenChange={setIsAddingExpense}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentTrip.people.length}</p>
                <p className="text-sm text-muted-foreground">People</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Receipt className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentTrip.expenses.length}</p>
                <p className="text-sm text-muted-foreground">Expenses</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <IndianRupee className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="expenses" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="balances">Balances</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Expenses</h2>
                <Button 
                  onClick={() => setIsAddingExpense(true)}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
              
              <ExpenseList trip={currentTrip} />
            </TabsContent>

            <TabsContent value="balances" className="space-y-4">
              <h2 className="text-2xl font-bold">Who Owes What</h2>
              <BalanceDisplay trip={currentTrip} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}