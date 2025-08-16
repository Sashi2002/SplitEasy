import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trip } from "@/contexts/TripContext";
import { Calendar, Trash2, Users } from "lucide-react";
import { useTrips } from "@/contexts/TripContext";
import { toast } from "@/hooks/use-toast";

interface ExpenseListProps {
  trip: Trip;
}

export function ExpenseList({ trip }: ExpenseListProps) {
  const { dispatch } = useTrips();

  const handleDeleteExpense = (expenseId: string) => {
    dispatch({
      type: "DELETE_EXPENSE",
      payload: { tripId: trip.id, expenseId }
    });
    toast({
      title: "Expense deleted",
      description: "The expense has been removed from your trip.",
    });
  };

  const getPersonName = (personId: string) => {
    return trip.people.find(p => p.id === personId)?.name || "Unknown";
  };

  if (trip.expenses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
          <p className="text-muted-foreground">
            Add your first expense to start tracking what everyone owes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trip.expenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((expense) => (
        <Card key={expense.id} className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{expense.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                                          <p className="text-lg font-semibold text-foreground">
                      ₹{expense.amount.toFixed(2)}
                    </p>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span>Paid by <strong>{getPersonName(expense.paidBy)}</strong></span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Split among:</span>
                    <Badge variant="secondary" className="text-xs">
                      {expense.splitAmong.length} people
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {expense.splitAmong.map(personId => {
                      const personName = getPersonName(personId);
                      let amount: number;
                      
                      if (expense.customSplits) {
                        amount = expense.customSplits[personId] || 0;
                      } else {
                        amount = expense.amount / expense.splitAmong.length;
                      }

                      return (
                        <div key={personId} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                          <span>{personName}</span>
                          <span className="font-medium">₹{amount.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}