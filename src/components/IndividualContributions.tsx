import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, TrendingUp, User } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';

interface IndividualContributionsProps {
  trip: Trip;
}

export function IndividualContributions({ trip }: IndividualContributionsProps) {
  const totalExpenses = trip.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate individual contributions
  const individualContributions = trip.people.map(person => {
    const totalPaid = trip.expenses
      .filter(expense => expense.paidBy === person.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const expenseCount = trip.expenses.filter(expense => expense.paidBy === person.id).length;
    
    return {
      person,
      totalPaid,
      expenseCount,
      percentage: totalExpenses > 0 ? (totalPaid / totalExpenses) * 100 : 0,
      averageExpense: expenseCount > 0 ? totalPaid / expenseCount : 0
    };
  }).sort((a, b) => b.totalPaid - a.totalPaid); // Sort by highest contribution first

  const topContributor = individualContributions[0];
  const averageContribution = totalExpenses / trip.people.length;

  if (trip.expenses.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <span>Individual Contributions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Add some expenses to see individual contributions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <span>Individual Contributions</span>
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total: ₹{totalExpenses.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Average: ₹{averageContribution.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top Contributor Highlight */}
        {topContributor && topContributor.totalPaid > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Top Contributor</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{topContributor.person.name}</span> has contributed the most with{' '}
                  <span className="font-medium text-primary">₹{topContributor.totalPaid.toFixed(2)}</span>
                  {' '}({topContributor.percentage.toFixed(1)}% of total)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Individual Contributions List */}
        <div className="space-y-4">
          {individualContributions.map(({ person, totalPaid, expenseCount, percentage, averageExpense }, index) => (
            <div key={person.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{person.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {expenseCount} expense{expenseCount !== 1 ? 's' : ''} • 
                      Avg: ₹{averageExpense.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{totalPaid.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {totalPaid > averageContribution ? 'Above average' : 
                     totalPaid < averageContribution ? 'Below average' : 'At average'}
                  </span>
                  <span>
                    {totalPaid > averageContribution ? 
                      `+₹${(totalPaid - averageContribution).toFixed(2)}` : 
                      totalPaid < averageContribution ? 
                        `-₹${(averageContribution - totalPaid).toFixed(2)}` : '±₹0.00'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Most Active</p>
              <p className="font-medium text-sm">
                {individualContributions.reduce((max, curr) => 
                  curr.expenseCount > max.expenseCount ? curr : max
                ).person.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Highest Single</p>
              <p className="font-medium text-sm">
                ₹{Math.max(...trip.expenses.map(e => e.amount)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contributors</p>
              <p className="font-medium text-sm">
                {individualContributions.filter(c => c.totalPaid > 0).length}/{trip.people.length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
