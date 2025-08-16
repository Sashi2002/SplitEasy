import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTrips, Trip, Person } from "@/contexts/TripContext";
import { Calculator, Plus, Users, ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Trips() {
  const navigate = useNavigate();
  const { state, dispatch } = useTrips();
  const [isCreating, setIsCreating] = useState(false);
  const [tripName, setTripName] = useState("");
  const [peopleNames, setPeopleNames] = useState<string[]>([""]);

  const handleCreateTrip = () => {
    if (!tripName.trim()) return;
    
    const validNames = peopleNames.filter(name => name.trim());
    if (validNames.length < 2) return;

    const newTrip: Trip = {
      id: Date.now().toString(),
      name: tripName.trim(),
      people: validNames.map(name => ({
        id: Date.now().toString() + Math.random(),
        name: name.trim()
      })),
      expenses: [],
      createdAt: new Date()
    };

    dispatch({ type: "ADD_TRIP", payload: newTrip });
    dispatch({ type: "SET_CURRENT_TRIP", payload: newTrip });
    
    // Reset form
    setTripName("");
    setPeopleNames([""]);
    setIsCreating(false);
    
    // Navigate to trip detail
    navigate(`/trips/${newTrip.id}`);
  };

  const addPersonField = () => {
    setPeopleNames([...peopleNames, ""]);
  };

  const updatePersonName = (index: number, name: string) => {
    const updated = [...peopleNames];
    updated[index] = name;
    setPeopleNames(updated);
  };

  const removePersonField = (index: number) => {
    if (peopleNames.length > 1) {
      setPeopleNames(peopleNames.filter((_, i) => i !== index));
    }
  };

  const selectTrip = (trip: Trip) => {
    dispatch({ type: "SET_CURRENT_TRIP", payload: trip });
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">SplitEasy</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Your Trips</h2>
              <p className="text-muted-foreground mt-2">
                Create a new trip or continue with an existing one
              </p>
            </div>
            
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Trip</DialogTitle>
                  <DialogDescription>
                    Start a new expense splitting session with friends
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trip-name">Trip Name</Label>
                    <Input
                      id="trip-name"
                      placeholder="Weekend in Paris"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>People</Label>
                    <div className="space-y-2 mt-2">
                      {peopleNames.map((name, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder={`Person ${index + 1}`}
                            value={name}
                            onChange={(e) => updatePersonName(index, e.target.value)}
                          />
                          {peopleNames.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePersonField(index)}
                              className="h-10 w-10 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPersonField}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Person
                      </Button>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTrip}
                    disabled={!tripName.trim() || peopleNames.filter(n => n.trim()).length < 2}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    Create Trip
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Trip List */}
          {state.trips.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first trip to start splitting expenses with friends
                </p>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Trip
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {state.trips.map((trip) => (
                <Card 
                  key={trip.id} 
                  className="card-hover cursor-pointer"
                  onClick={() => selectTrip(trip)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{trip.name}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">
                          Created {trip.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {trip.expenses.length} expenses
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {trip.people.length} people
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {trip.people.slice(0, 2).map(p => p.name).join(', ')}
                          {trip.people.length > 2 && ` +${trip.people.length - 2} more`}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                                                  <p className="text-sm text-muted-foreground">
                          ₹{trip.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                        </p>
                        </p>
                        <p className="text-xs text-muted-foreground">total spent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}