/**
 * Formats a Date object or YYYY-MM-DD string to DD-MM-YYYY
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput; // Return raw if invalid

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * Returns today's date in YYYY-MM-DD format (local time)
 */
export const getTodayString = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

/**
 * Returns the CSS class for attendance status badges
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Present':
      return 'badge badge-present';
    case 'Absent':
      return 'badge badge-absent';
    case 'Leave':
      return 'badge badge-leave';
    default:
      return 'badge';
  }
};

/**
 * Common list of departments in organizations/colleges
 */
export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Human Resources',
  'Marketing',
  'Finance'
];
