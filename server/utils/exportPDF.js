const PDFDocument = require('pdfkit');

const generatePDF = (records, filters, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Pipe to response stream
  doc.pipe(res);

  // 1. Header Section
  doc.fillColor('#1E3A8A').font('Helvetica-Bold').fontSize(22).text('Attendance Management System', { align: 'center' });
  doc.fillColor('#374151').font('Helvetica').fontSize(14).text('Attendance Report', { align: 'center', margin: 10 });
  doc.moveDown(1);

  // Filter criteria display
  doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  const filterString = `Date Range: ${filters.startDate || 'N/A'} to ${filters.endDate || 'N/A'}   |   Department: ${filters.department || 'All'}   |   Status Filter: ${filters.status || 'All'}`;
  doc.fillColor('#6B7280').font('Helvetica-Oblique').fontSize(9).text(filterString, { align: 'left' });
  doc.moveDown(0.5);
  doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1.5);

  // 2. Table Headers
  const tableTop = doc.y;
  const colWidths = {
    date: 75,
    id: 70,
    name: 110,
    department: 85,
    status: 60,
    remarks: 110
  };

  const colPositions = {
    date: 40,
    id: 115,
    name: 185,
    department: 295,
    status: 380,
    remarks: 440
  };

  // Draw Header Background
  doc.rect(40, tableTop - 5, 510, 22).fill('#1E3A8A');

  // Draw Header Labels
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
  doc.text('Date', colPositions.date, tableTop);
  doc.text('ID', colPositions.id, tableTop);
  doc.text('Name', colPositions.name, tableTop);
  doc.text('Dept', colPositions.department, tableTop);
  doc.text('Status', colPositions.status, tableTop);
  doc.text('Remarks', colPositions.remarks, tableTop);

  let currentY = tableTop + 20;

  // 3. Table Rows
  records.forEach((record, index) => {
    // If we're reaching the bottom of the page, add a new page
    if (currentY > 750) {
      doc.addPage();
      currentY = 50;
      
      // Redraw table headers on new page
      doc.rect(40, currentY - 5, 510, 22).fill('#1E3A8A');
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
      doc.text('Date', colPositions.date, currentY);
      doc.text('ID', colPositions.id, currentY);
      doc.text('Name', colPositions.name, currentY);
      doc.text('Dept', colPositions.department, currentY);
      doc.text('Status', colPositions.status, currentY);
      doc.text('Remarks', colPositions.remarks, currentY);
      
      currentY += 20;
    }

    // Zebra striping background
    if (index % 2 === 1) {
      doc.rect(40, currentY - 4, 510, 18).fill('#F9FAFB');
    }

    // Determine status color
    let statusColor = '#374151'; // Dark gray
    if (record.status === 'Present') statusColor = '#16A34A'; // Green
    if (record.status === 'Absent') statusColor = '#DC2626'; // Red
    if (record.status === 'Leave') statusColor = '#D97706'; // Amber

    // Write row values
    doc.fillColor('#374151').font('Helvetica').fontSize(8.5);
    doc.text(record.dateString || '', colPositions.date, currentY);
    doc.text(record.employee ? record.employee.employeeId : (record.employeeId || ''), colPositions.id, currentY);
    doc.text(record.employee ? record.employee.name : '', colPositions.name, currentY, { width: colWidths.name, ellipsis: true });
    doc.text(record.employee ? record.employee.department : '', colPositions.department, currentY, { width: colWidths.department, ellipsis: true });
    
    // Status in bold and custom color
    doc.fillColor(statusColor).font('Helvetica-Bold');
    doc.text(record.status || '', colPositions.status, currentY);

    // Remarks
    doc.fillColor('#6B7280').font('Helvetica');
    doc.text(record.remarks || '', colPositions.remarks, currentY, { width: colWidths.remarks, ellipsis: true });

    // Draw bottom border line
    doc.strokeColor('#F3F4F6').lineWidth(0.5).moveTo(40, currentY + 14).lineTo(550, currentY + 14).stroke();

    currentY += 18;
  });

  // Footer / Page numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#9CA3AF').fontSize(8);
    doc.text(
      `Generated on ${new Date().toLocaleString()}   |   Page ${i + 1} of ${pages.count}`,
      40,
      800,
      { align: 'center', width: 510 }
    );
  }

  // Finalize document
  doc.end();
};

module.exports = { generatePDF };
