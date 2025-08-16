import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { exportToExcelLazy, exportToPDFLazy } from '@/lib/exportLazy';
import { useToast } from '@/hooks/use-toast';

interface ExportSectionProps {
  trip: Trip;
}

export default function ExportSection({ trip }: ExportSectionProps) {
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { toast } = useToast();

  const handleExcelExport = async () => {
    if (trip.expenses.length === 0) {
      toast({
        title: "No data to export",
        description: "Add some expenses before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsExportingExcel(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
      await exportToExcelLazy(trip);
      toast({
        title: "Excel exported successfully",
        description: `${trip.name}_expenses.xlsx has been downloaded.`,
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting to Excel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handlePDFExport = async () => {
    if (trip.expenses.length === 0) {
      toast({
        title: "No data to export",
        description: "Add some expenses before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsExportingPDF(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
      await exportToPDFLazy(trip);
      toast({
        title: "PDF exported successfully",
        description: `${trip.name}_expenses.pdf has been downloaded.`,
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const totalExpenses = trip.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-primary" />
              <span>Export Data</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Download trip expenses and balances
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {trip.expenses.length} expense{trip.expenses.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Excel Export */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <h4 className="font-medium">Excel Spreadsheet</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete data with multiple sheets including expenses, balances, and settlements.
            </p>
            <Button
              onClick={handleExcelExport}
              disabled={isExportingExcel || trip.expenses.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              {isExportingExcel ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Download Excel
                </>
              )}
            </Button>
          </div>

          {/* PDF Export */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-red-600" />
              <h4 className="font-medium">PDF Report</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional report with formatted tables, perfect for sharing and printing.
            </p>
            <Button
              onClick={handlePDFExport}
              disabled={isExportingPDF || trip.expenses.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {trip.expenses.length === 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Add some expenses to enable export functionality
            </p>
          </div>
        )}

        {trip.expenses.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Total Amount:</span>
              <span className="font-medium">₹{totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Participants:</span>
              <span className="font-medium">{trip.people.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Export includes:</span>
              <span className="font-medium">All data & settlements</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
