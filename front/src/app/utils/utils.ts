/**
 * Implemented from https://medium.com/@pancemarko/deep-equality-in-javascript-determining-if-two-objects-are-equal-bf98cf47e934
 * If not working enough, this one seems more accurate : https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
 */
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

export function getStartAndEndOfWeek(date: Date): {
  weekStart: string;
  weekEnd: string;
} {
  // Get the day of the week: 0 (Sunday) to 6 (Saturday)
  const dayOfWeek = date.getDay();

  // Calculate the difference in days to Monday
  const daysToMonday = (dayOfWeek + 6) % 7;

  // Create a new date object for the start of the week (Monday)
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysToMonday);

  // Create a new date object for the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    weekStart: formatDate(startOfWeek),
    weekEnd: formatDate(endOfWeek),
  };
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
