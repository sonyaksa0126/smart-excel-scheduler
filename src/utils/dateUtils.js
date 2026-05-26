/**
 * Helpers for calendar and date operations
 */

// South Korean national holiday database (2025, 2026, 2027)
const HOLIDAYS_DB = {
  // Solar fixed holidays (same every year)
  fixed: {
    '01-01': '신정',
    '03-01': '삼일절',
    '05-05': '어린이날',
    '06-06': '현충일',
    '08-15': '광복절',
    '10-03': '개천절',
    '10-09': '한글날',
    '12-25': '성탄절'
  },
  // Precomputed lunar & movable holidays (including substitute public holidays)
  movable: {
    // 2025
    '2025-01-28': '설날 연휴',
    '2025-01-29': '설날',
    '2025-01-30': '설날 연휴',
    '2025-05-06': '대체공휴일', // 부처님오신날(5/5) 대체공휴일
    '2025-10-05': '추석 연휴',
    '2025-10-06': '추석',
    '2025-10-07': '추석 연휴',
    '2025-10-08': '대체공휴일', // 추석 대체공휴일

    // 2026
    '2026-02-16': '설날 연휴',
    '2026-02-17': '설날',
    '2026-02-18': '설날 연휴',
    '2026-02-19': '대체공휴일', // 설날 대체공휴일
    '2026-05-24': '부처님오신날',
    '2026-05-25': '대체공휴일', // 부처님오신날 대체공휴일
    '2026-09-24': '추석 연휴',
    '2026-09-25': '추석',
    '2026-09-26': '추석 연휴',
    '2026-09-28': '대체공휴일', // 추석 대체공휴일

    // 2027
    '2027-02-06': '설날 연휴',
    '2027-02-07': '설날',
    '2027-02-08': '설날 연휴',
    '2027-02-09': '대체공휴일', // 설날 대체공휴일
    '2027-05-13': '부처님오신날',
    '2027-09-14': '추석 연휴',
    '2027-09-15': '추석',
    '2027-09-16': '추석 연휴',
    '2027-09-17': '대체공휴일' // 추석 대체공휴일
  }
};

/**
 * Returns the South Korean holiday name for a date string 'YYYY-MM-DD' if it matches, otherwise null
 */
export const getKoreanHoliday = (dateStr) => {
  if (!dateStr) return null;
  
  // 1. Check precomputed movable holidays (exact matches)
  if (HOLIDAYS_DB.movable[dateStr]) {
    return HOLIDAYS_DB.movable[dateStr];
  }

  // 2. Check solar fixed holidays (MM-DD matches)
  const monthDay = dateStr.substring(5); // Extracts 'MM-DD'
  if (HOLIDAYS_DB.fixed[monthDay]) {
    return HOLIDAYS_DB.fixed[monthDay];
  }

  return null;
};

/**
 * Returns a string representation of a Date object in YYYY-MM-DD format (local timezone)
 */
export const formatDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generates the full 35 or 42 grid cells for a calendar month.
 * Includes padding days from the previous month and next month.
 */
export const getMonthDaysGrid = (year, monthIndex) => {
  // First day of current month
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  // Day of week for first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const startDayOfWeek = firstDayOfMonth.getDay();
  
  // Total days in current month
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  
  // Total days in previous month
  const totalDaysInPrevMonth = new Date(year, monthIndex, 0).getDate();
  
  const cells = [];
  
  // 1. Previous month's padding days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = totalDaysInPrevMonth - i;
    const dateObj = new Date(year, monthIndex - 1, day);
    cells.push({
      date: dateObj,
      dateString: formatDateString(dateObj),
      day,
      isCurrentMonth: false,
    });
  }
  
  // 2. Current month's days
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dateObj = new Date(year, monthIndex, day);
    cells.push({
      date: dateObj,
      dateString: formatDateString(dateObj),
      day,
      isCurrentMonth: true,
    });
  }
  
  // 3. Next month's padding days
  const totalCellsNeeded = cells.length > 35 ? 42 : 35;
  const nextMonthPadding = totalCellsNeeded - cells.length;
  
  for (let day = 1; day <= nextMonthPadding; day++) {
    const dateObj = new Date(year, monthIndex + 1, day);
    cells.push({
      date: dateObj,
      dateString: formatDateString(dateObj),
      day,
      isCurrentMonth: false,
    });
  }
  
  return cells;
};

/**
 * Checks if two dates are on the same day
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};
