import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SEO, seoConfigs } from "@/components/SEO";
import { Calculator, Users, Receipt, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <SEO {...seoConfigs.home} />
      <div className="min-h-screen bg-hero-gradient">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">SplitEasy</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Split expenses easily with
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}friends
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            No more awkward money conversations. Track shared expenses, split bills fairly, 
            and settle up with friends on trips, dinners, and group activities.
          </p>

          <Button
            onClick={() => navigate('/trips')}
            variant="hero"
            size="lg"
            className="text-lg px-8 py-6 h-auto rounded-2xl"
          >
            Start Splitting
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <Card className="card-hover p-8 bg-card/50 backdrop-blur-sm border border-border/50">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Add Friends</h3>
            <p className="text-muted-foreground">
              Easily add people to your trip and manage who's involved in each expense.
            </p>
          </Card>

          <Card className="card-hover p-8 bg-card/50 backdrop-blur-sm border border-border/50">
            <Receipt className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Track Expenses</h3>
            <p className="text-muted-foreground">
              Log expenses with custom splits - equal shares or custom amounts for each person.
            </p>
          </Card>

          <Card className="card-hover p-8 bg-card/50 backdrop-blur-sm border border-border/50">
            <IndianRupee className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Settle Up</h3>
            <p className="text-muted-foreground">
              See exactly who owes what and get the minimum number of transactions to settle.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border/20 text-center">
        <p className="text-muted-foreground">
          Built with React, TypeScript, and Tailwind CSS • No accounts required
        </p>
      </footer>
    </div>
    </>
  );
}