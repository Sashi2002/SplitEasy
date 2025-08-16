// Lazy loading wrapper for export utilities to reduce main bundle size
import { Trip } from '@/contexts/TripContext';

export const exportToExcelLazy = async (trip: Trip) => {
  const { exportToExcel } = await import('./exportUtils');
  return exportToExcel(trip);
};

export const exportToPDFLazy = async (trip: Trip) => {
  const { exportToPDF } = await import('./exportUtils');
  return exportToPDF(trip);
};
