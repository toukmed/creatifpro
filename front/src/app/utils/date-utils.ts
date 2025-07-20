const options = { year: 'numeric', month: 'short', day: 'numeric' };

export function areDeeplyEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((elem, index) => {
      return areDeeplyEqual(elem, obj2[index]);
    });
  }

  if (
    typeof obj1 === 'object' &&
    typeof obj2 === 'object' &&
    obj1 !== null &&
    obj2 !== null
  ) {
    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (
      keys1.length !== keys2.length ||
      !keys1.every((key) => keys2.includes(key))
    )
      return false;

    for (let key in obj1) {
      let isEqual = areDeeplyEqual(obj1[key], obj2[key]);
      if (!isEqual) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function displayFn(element: any): string {
  const nom = element?.nom;
  const prenom = element?.prenom;
  const reference = element?.reference;

  if (nom && reference) {
    return nom + (reference ? ' (' + element?.reference + ')' : '');
  }
  if (nom && prenom) {
    return nom + (prenom ? ' ' + element?.prenom : '');
  }
  return nom || '';
}

export function getStartOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysToMonday);

  return startOfWeek;
}

export function getEndOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysToMonday);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return endOfWeek;
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatToShortFormatDate(stringDate: string): string {
  const date = new Date(stringDate);
  return `${date.getDate()} ${date.toLocaleString('default', {
    month: 'short',
  })}`;
}

export function getStartOfWeekDate(date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysToMonday);

  return startOfWeek;
}

export function getEndOfWeekDate(date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysToMonday);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return endOfWeek;
}

export function formatToShortDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getPreviousMonth(date: Date): Date {
  const previousMonthDate = new Date(date);

  previousMonthDate.setMonth(date.getMonth() - 1);

  return previousMonthDate;
}

export function getNextMonth(date: Date): Date {
  const previousMonthDate = new Date(date);

  previousMonthDate.setMonth(date.getMonth() + 1);

  return previousMonthDate;
}

export function formatMonthRange(date: Date): string {
  const startOfMonth = getStartOfMonth(date);
  const endOfMonth = getEndOfMonth(date);

  // Format day and month name
  const dayFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric' });
  const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' });

  const startDay = dayFormatter.format(startOfMonth);
  const endDay = dayFormatter.format(endOfMonth);
  const monthName = monthFormatter.format(startOfMonth); // Same month for both start and end

  // Return formatted string
  return `${monthName} ${date.getFullYear()} `;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function formatDateToString(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month, add 1 because months are zero-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
export function formatDateToDashedString(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month, add 1 because months are zero-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function getDatesInRange(
  startDateString: string,
  endDateString: string
): Date[] {
  const startDate = parseDate(startDateString);
  const endDate = parseDate(endDateString);

  const datesInRange: Date[] = [];

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    datesInRange.push(new Date(date));
  }

  return datesInRange;
}

export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split(' ')[1].split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
