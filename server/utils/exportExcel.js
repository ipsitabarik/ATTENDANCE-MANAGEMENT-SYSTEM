const ExcelJS = require('exceljs');

const generateExcel = async (records, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Report');

  // Define Columns
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Employee/Student ID', key: 'employeeId', width: 25 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Department', key: 'department', width: 20 },
    { header: 'Designation', key: 'designation', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Remarks', key: 'remarks', width: 30 }
  ];

  // Apply basic formatting to headers
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1E3A8A' } // Navy blue
  };

  // Add rows
  records.forEach((record) => {
    worksheet.addRow({
      date: record.dateString || '',
      employeeId: record.employee ? record.employee.employeeId : (record.employeeId || ''),
      name: record.employee ? record.employee.name : '',
      department: record.employee ? record.employee.department : '',
      designation: record.employee ? record.employee.designation : '',
      status: record.status || '',
      remarks: record.remarks || ''
    });
  });

  // Apply conditional coloring for Status
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip headers

    const statusCell = row.getCell('status');
    const val = statusCell.value;

    if (val === 'Present') {
      statusCell.font = { color: { argb: '15803D' }, bold: true }; // Green
    } else if (val === 'Absent') {
      statusCell.font = { color: { argb: 'B91C1C' }, bold: true }; // Red
    } else if (val === 'Leave') {
      statusCell.font = { color: { argb: 'B45309' }, bold: true }; // Yellow/Amber
    }
  });

  // Write sheet to stream/response
  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { generateExcel };
