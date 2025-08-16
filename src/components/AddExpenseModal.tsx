import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrips, Trip, Expense } from "@/contexts/TripContext";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface AddExpenseModalProps {
  trip: Trip;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseModal({ trip, isOpen, onOpenChange }: AddExpenseModalProps) {
  const { dispatch } = useTrips();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<{ [personId: string]: string }>({});

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setPaidBy("");
    setSplitType("equal");
    setSelectedPeople([]);
    setCustomSplits({});
  };

  const handleAddExpense = () => {
    if (!title.trim() || !amount || !paidBy || selectedPeople.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    let finalCustomSplits: { [personId: string]: number } | undefined;

    if (splitType === "custom") {
      const splits: { [personId: string]: number } = {};
      let totalCustom = 0;

      for (const personId of selectedPeople) {
        const customAmount = parseFloat(customSplits[personId] || "0");
        if (isNaN(customAmount) || customAmount < 0) {
          toast({
            title: "Invalid custom split",
            description: "Please enter valid amounts for all people.",
            variant: "destructive",
          });
          return;
        }
        splits[personId] = customAmount;
        totalCustom += customAmount;
      }

      if (Math.abs(totalCustom - amountNum) > 0.01) {
        toast({
          title: "Split amounts don't match",
          description: `Custom splits total ₹${totalCustom.toFixed(2)} but expense is ₹${amountNum.toFixed(2)}.`,
          variant: "destructive",
        });
        return;
      }

      finalCustomSplits = splits;
    }

    const newExpense: Expense = {
      id: Date.now().toString() + Math.random(),
      title: title.trim(),
      amount: amountNum,
      paidBy,
      splitAmong: selectedPeople,
      customSplits: finalCustomSplits,
      date: new Date(),
    };

    dispatch({ 
      type: "ADD_EXPENSE", 
      payload: { tripId: trip.id, expense: newExpense } 
    });

    toast({
      title: "Expense added",
      description: `${title} for ₹${amountNum.toFixed(2)} has been added.`,
    });

    resetForm();
    onOpenChange(false);
  };

  const togglePerson = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const handleCustomSplitChange = (personId: string, value: string) => {
    setCustomSplits(prev => ({
      ...prev,
      [personId]: value
    }));
  };

  const totalCustomSplits = selectedPeople.reduce((sum, personId) => {
    return sum + (parseFloat(customSplits[personId]) || 0);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Split a new expense among the people in your trip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Expense Description</Label>
              <Input
                id="title"
                placeholder="Dinner at restaurant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paid-by">Paid by</Label>
                <Select value={paidBy} onValueChange={setPaidBy}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {trip.people.map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Split Options */}
          <div>
            <Label className="text-base font-medium">How to split?</Label>
            <Tabs value={splitType} onValueChange={(value) => setSplitType(value as "equal" | "custom")} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="equal">Split Equally</TabsTrigger>
                <TabsTrigger value="custom">Custom Amounts</TabsTrigger>
              </TabsList>

              <TabsContent value="equal" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Who should split this expense?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trip.people.map(person => (
                      <div key={person.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={person.id}
                          checked={selectedPeople.includes(person.id)}
                          onCheckedChange={() => togglePerson(person.id)}
                        />
                        <Label htmlFor={person.id} className="flex-1 cursor-pointer">
                          {person.name}
                          {selectedPeople.includes(person.id) && amount && (
                            <span className="text-sm text-muted-foreground ml-2">
                              (₹{(parseFloat(amount) / selectedPeople.length).toFixed(2)} each)
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Custom split amounts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trip.people.map(person => (
                      <div key={person.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`custom-${person.id}`}
                          checked={selectedPeople.includes(person.id)}
                          onCheckedChange={() => togglePerson(person.id)}
                        />
                        <Label htmlFor={`custom-${person.id}`} className="flex-1">
                          {person.name}
                        </Label>
                        {selectedPeople.includes(person.id) && (
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={customSplits[person.id] || ""}
                            onChange={(e) => handleCustomSplitChange(person.id, e.target.value)}
                            className="w-24"
                          />
                        )}
                      </div>
                    ))}
                    {splitType === "custom" && selectedPeople.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Total splits:</span>
                          <span className={totalCustomSplits !== parseFloat(amount || "0") ? "text-destructive" : "text-foreground"}>
                            ₹{totalCustomSplits.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expense amount:</span>
                          <span>₹{(parseFloat(amount) || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddExpense}
            disabled={!title.trim() || !amount || !paidBy || selectedPeople.length === 0}
            className="bg-gradient-to-r from-primary to-accent"
          >
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}