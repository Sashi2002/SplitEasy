import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Trip, calculateBalances, calculateSettlements } from '@/contexts/TripContext';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function exportToExcel(trip: Trip) {
  const workbook = XLSX.utils.book_new();
  
  // Trip Summary Sheet
  const summaryData = [
    ['Trip Name', trip.name],
    ['Created Date', trip.createdAt.toLocaleDateString()],
    ['Export Date', new Date().toLocaleDateString()],
    ['Number of People', trip.people.length],
    ['Total Expenses', trip.expenses.length],
    ['Total Amount', `₹${trip.expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}`],
    [''], // Empty row
    ['Participants:'],
    ...trip.people.map(person => ['', person.name])
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Trip Summary');
  
  // Expenses Sheet
  const expenseHeaders = ['Date', 'Title', 'Amount (₹)', 'Paid By', 'Split Among', 'Split Type'];
  const expenseData = [
    expenseHeaders,
    ...trip.expenses.map(expense => {
      const paidByName = trip.people.find(p => p.id === expense.paidBy)?.name || 'Unknown';
      const splitAmongNames = expense.splitAmong
        .map(id => trip.people.find(p => p.id === id)?.name || 'Unknown')
        .join(', ');
      const splitType = expense.customSplits ? 'Custom' : 'Equal';
      
      return [
        expense.date.toLocaleDateString(),
        expense.title,
        expense.amount.toFixed(2),
        paidByName,
        splitAmongNames,
        splitType
      ];
    })
  ];
  
  const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
  XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
  
  // Custom Splits Detail (if any)
  const customSplitsData: any[][] = [['Expense', 'Person', 'Amount (₹)']];
  trip.expenses.forEach(expense => {
    if (expense.customSplits) {
      Object.entries(expense.customSplits).forEach(([personId, amount]) => {
        const personName = trip.people.find(p => p.id === personId)?.name || 'Unknown';
        customSplitsData.push([expense.title, personName, amount.toFixed(2)]);
      });
    }
  });
  
  if (customSplitsData.length > 1) {
    const customSplitsSheet = XLSX.utils.aoa_to_sheet(customSplitsData);
    XLSX.utils.book_append_sheet(workbook, customSplitsSheet, 'Custom Splits');
  }
  
  // Balances Sheet
  const balances = calculateBalances(trip);
  const settlements = calculateSettlements(trip);
  
  const balanceData = [
    ['Person', 'Balance (₹)', 'Status'],
    ...trip.people.map(person => {
      const balance = balances[person.id] || 0;
      let status = 'Settled';
      if (balance > 0.01) status = 'Gets Back';
      if (balance < -0.01) status = 'Owes';
      
      return [
        person.name,
        balance.toFixed(2),
        status
      ];
    }),
    [''], // Empty row
    ['Settlement Suggestions:'],
    ['From', 'To', 'Amount (₹)'],
    ...settlements.map(settlement => {
      const fromName = trip.people.find(p => p.id === settlement.from)?.name || 'Unknown';
      const toName = trip.people.find(p => p.id === settlement.to)?.name || 'Unknown';
      return [fromName, toName, settlement.amount.toFixed(2)];
    })
  ];
  
  const balanceSheet = XLSX.utils.aoa_to_sheet(balanceData);
  XLSX.utils.book_append_sheet(workbook, balanceSheet, 'Balances');
  
  // Save the file
  const fileName = `${trip.name.replace(/[^a-z0-9]/gi, '_')}_expenses.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportToPDF(trip: Trip) {
  const doc = new jsPDF();
  const balances = calculateBalances(trip);
  const settlements = calculateSettlements(trip);
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 51, 50); // Dark color
  doc.text(trip.name, 20, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 35);
  doc.text(`Created: ${trip.createdAt.toLocaleDateString()}`, 20, 42);
  
  // Trip Summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Trip Summary', 20, 55);
  
  const summaryData = [
    ['Participants', trip.people.length.toString()],
    ['Total Expenses', trip.expenses.length.toString()],
    ['Total Amount', `₹${trip.expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}`]
  ];
  
  doc.autoTable({
    startY: 60,
    head: [['Category', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [34, 211, 238] }, // Teal color
    margin: { left: 20 }
  });
  
  // Participants
  let currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Participants', 20, currentY);
  
  const participantData = trip.people.map(person => [person.name]);
  
  doc.autoTable({
    startY: currentY + 5,
    head: [['Name']],
    body: participantData,
    theme: 'grid',
    headStyles: { fillColor: [34, 211, 238] },
    margin: { left: 20 }
  });
  
  // Add new page for expenses
  doc.addPage();
  
  // Expenses
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Expenses', 20, 25);
  
  const expenseData = trip.expenses.map(expense => {
    const paidByName = trip.people.find(p => p.id === expense.paidBy)?.name || 'Unknown';
    const splitAmongNames = expense.splitAmong
      .map(id => trip.people.find(p => p.id === id)?.name || 'Unknown')
      .join(', ');
    
    return [
      expense.date.toLocaleDateString(),
      expense.title,
      `₹${expense.amount.toFixed(2)}`,
      paidByName,
      splitAmongNames.length > 20 ? splitAmongNames.substring(0, 20) + '...' : splitAmongNames
    ];
  });
  
  doc.autoTable({
    startY: 35,
    head: [['Date', 'Title', 'Amount', 'Paid By', 'Split Among']],
    body: expenseData,
    theme: 'grid',
    headStyles: { fillColor: [34, 211, 238] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 50 }
    }
  });
  
  // Add new page for balances
  doc.addPage();
  
  // Balances
  doc.setFontSize(16);
  doc.text('Balances & Settlements', 20, 25);
  
  const balanceData = trip.people.map(person => {
    const balance = balances[person.id] || 0;
    let status = 'Settled';
    let statusColor = 'green';
    
    if (balance > 0.01) {
      status = 'Gets Back';
      statusColor = 'green';
    }
    if (balance < -0.01) {
      status = 'Owes';
      statusColor = 'red';
    }
    
    return [
      person.name,
      `₹${balance.toFixed(2)}`,
      status
    ];
  });
  
  doc.autoTable({
    startY: 35,
    head: [['Person', 'Balance', 'Status']],
    body: balanceData,
    theme: 'grid',
    headStyles: { fillColor: [34, 211, 238] },
    margin: { left: 20 }
  });
  
  // Settlement Suggestions
  if (settlements.length > 0) {
    currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Settlement Suggestions', 20, currentY);
    
    const settlementData = settlements.map(settlement => {
      const fromName = trip.people.find(p => p.id === settlement.from)?.name || 'Unknown';
      const toName = trip.people.find(p => p.id === settlement.to)?.name || 'Unknown';
      return [fromName, toName, `₹${settlement.amount.toFixed(2)}`];
    });
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['From', 'To', 'Amount']],
      body: settlementData,
      theme: 'grid',
      headStyles: { fillColor: [34, 211, 238] },
      margin: { left: 20 }
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated by SplitEasy - Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10);
  }
  
  // Save the file
  const fileName = `${trip.name.replace(/[^a-z0-9]/gi, '_')}_expenses.pdf`;
  doc.save(fileName);
}
