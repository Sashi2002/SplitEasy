import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trip, calculateBalances, calculateSettlements } from "@/contexts/TripContext";
import { ArrowRight, CheckCircle } from "lucide-react";

interface BalanceDisplayProps {
  trip: Trip;
}

export function BalanceDisplay({ trip }: BalanceDisplayProps) {
  const balances = calculateBalances(trip);
  const settlements = calculateSettlements(trip);

  const getPersonName = (personId: string) => {
    return trip.people.find(p => p.id === personId)?.name || "Unknown";
  };

  // Check if all balances are settled (close to zero)
  const isAllSettled = Object.values(balances).every(balance => Math.abs(balance) < 0.01);

  if (trip.expenses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            No expenses yet. Add some expenses to see the balance breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Individual Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Individual Balances</span>
            {isAllSettled && (
              <Badge variant="outline" className="text-positive border-positive">
                <CheckCircle className="h-3 w-3 mr-1" />
                All Settled
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trip.people.map(person => {
              const balance = balances[person.id] || 0;
              const isPositive = balance > 0.01;
              const isNegative = balance < -0.01;
              const isSettled = Math.abs(balance) <= 0.01;

              return (
                <div key={person.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{person.name}</span>
                  <div className="text-right">
                    {isSettled ? (
                      <Badge variant="outline" className="text-positive border-positive">
                        Settled
                      </Badge>
                    ) : isPositive ? (
                      <div>
                        <span className="amount-positive text-lg">
                          +₹{balance.toFixed(2)}
                        </span>
                        <p className="text-xs text-muted-foreground">gets back</p>
                      </div>
                    ) : (
                      <div>
                        <span className="amount-negative text-lg">
                          ₹{Math.abs(balance).toFixed(2)}
                        </span>
                        <p className="text-xs text-muted-foreground">owes</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settlement Suggestions */}
      {!isAllSettled && settlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Settlements</CardTitle>
            <p className="text-sm text-muted-foreground">
              Minimum transfers needed to settle all debts
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">
                      {getPersonName(settlement.from)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {getPersonName(settlement.to)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-lg">
                      ₹{settlement.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {settlements.length} transfer{settlements.length !== 1 ? 's' : ''} needed to settle all debts
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Settled State */}
      {isAllSettled && (
        <Card className="border-positive/20 bg-positive/5">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-positive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-positive mb-2">
              All Settled Up!
            </h3>
            <p className="text-muted-foreground">
              Everyone's debts have been balanced. No transfers needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}