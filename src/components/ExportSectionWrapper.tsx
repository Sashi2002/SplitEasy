import { lazy, Suspense } from 'react';
import { Trip } from '@/contexts/TripContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';

// Lazy load the actual export section to reduce main bundle size
const LazyExportSection = lazy(() => import('./ExportSection'));

interface ExportSectionWrapperProps {
  trip: Trip;
}

const ExportLoader = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Download className="h-5 w-5 text-primary" />
        <span>Export Data</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center py-8">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading export options...</span>
      </div>
    </CardContent>
  </Card>
);

export function ExportSectionWrapper({ trip }: ExportSectionWrapperProps) {
  return (
    <Suspense fallback={<ExportLoader />}>
      <LazyExportSection trip={trip} />
    </Suspense>
  );
}
