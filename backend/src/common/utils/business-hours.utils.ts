import { BusinessHourDto, BreakPeriodDto } from '../../shops/dto/business-hours.dto';

/**
 * Validates business hours for logical consistency
 */
export function validateBusinessHours(hours: BusinessHourDto[]): string[] {
  const errors: string[] = [];

  // Check we have all 7 days
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const providedDays = hours.map(h => h.day);
  const missingDays = days.filter(d => !providedDays.includes(d as any));
  
  if (missingDays.length > 0) {
    errors.push(`Missing days: ${missingDays.join(', ')}`);
  }

  // Check for duplicates
  const duplicates = providedDays.filter((day, index) => providedDays.indexOf(day) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate days: ${duplicates.join(', ')}`);
  }

  // Validate each day
  hours.forEach(dayHours => {
    if (dayHours.isOpen) {
      // Must have open and close times
      if (!dayHours.openTime || !dayHours.closeTime) {
        errors.push(`${dayHours.day}: Open days must have openTime and closeTime`);
        return;
      }

      // Open time must be before close time
      const openMinutes = timeToMinutes(dayHours.openTime);
      const closeMinutes = timeToMinutes(dayHours.closeTime);

      if (openMinutes >= closeMinutes) {
        errors.push(`${dayHours.day}: Opening time must be before closing time`);
      }

      // Validate breaks
      if (dayHours.breaks && dayHours.breaks.length > 0) {
        dayHours.breaks.forEach((breakPeriod, index) => {
          const breakStart = timeToMinutes(breakPeriod.start);
          const breakEnd = timeToMinutes(breakPeriod.end);

          // Break start must be before break end
          if (breakStart >= breakEnd) {
            errors.push(`${dayHours.day} break ${index + 1}: Start time must be before end time`);
          }

          // Break must be within business hours
          if (breakStart < openMinutes || breakEnd > closeMinutes) {
            errors.push(`${dayHours.day} break ${index + 1}: Must be within business hours`);
          }

          // Check for overlapping breaks
          dayHours.breaks.forEach((otherBreak, otherIndex) => {
            if (index !== otherIndex) {
              const otherStart = timeToMinutes(otherBreak.start);
              const otherEnd = timeToMinutes(otherBreak.end);

              if (
                (breakStart >= otherStart && breakStart < otherEnd) ||
                (breakEnd > otherStart && breakEnd <= otherEnd) ||
                (breakStart <= otherStart && breakEnd >= otherEnd)
              ) {
                errors.push(`${dayHours.day}: Breaks ${index + 1} and ${otherIndex + 1} overlap`);
              }
            }
          });
        });
      }
    }
  });

  return errors;
}

/**
 * Check if a shop is currently open
 */
export function isShopOpenNow(
  businessHours: BusinessHourDto[],
  timezone: string = 'UTC'
): boolean {
  const now = new Date();
  const dayName = getDayName(now);
  const currentTime = formatTime(now);

  return isShopOpenAt(businessHours, dayName, currentTime);
}

/**
 * Check if shop is open at a specific day and time
 */
export function isShopOpenAt(
  businessHours: BusinessHourDto[],
  day: string,
  time: string
): boolean {
  const dayHours = businessHours.find(h => h.day === day.toLowerCase());
  
  if (!dayHours || !dayHours.isOpen) {
    return false;
  }

  const currentMinutes = timeToMinutes(time);
  const openMinutes = timeToMinutes(dayHours.openTime!);
  const closeMinutes = timeToMinutes(dayHours.closeTime!);

  // Check if within business hours
  if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
    return false;
  }

  // Check if during a break
  if (dayHours.breaks && dayHours.breaks.length > 0) {
    for (const breakPeriod of dayHours.breaks) {
      const breakStart = timeToMinutes(breakPeriod.start);
      const breakEnd = timeToMinutes(breakPeriod.end);

      if (currentMinutes >= breakStart && currentMinutes < breakEnd) {
        return false; // Currently on break
      }
    }
  }

  return true;
}

/**
 * Get the next opening time for a shop
 */
export function getNextOpening(
  businessHours: BusinessHourDto[],
  timezone: string = 'UTC'
): { day: string; time: string } | null {
  const now = new Date();
  const currentDay = getDayName(now);
  const currentTime = formatTime(now);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentDayIndex = days.indexOf(currentDay.toLowerCase());

  // Check remaining time today
  const todayHours = businessHours.find(h => h.day === currentDay.toLowerCase());
  if (todayHours && todayHours.isOpen) {
    const currentMinutes = timeToMinutes(currentTime);
    const openMinutes = timeToMinutes(todayHours.openTime!);

    if (currentMinutes < openMinutes) {
      return { day: currentDay, time: todayHours.openTime! };
    }
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDay = days[nextDayIndex];
    const nextDayHours = businessHours.find(h => h.day === nextDay);

    if (nextDayHours && nextDayHours.isOpen) {
      return { day: nextDay, time: nextDayHours.openTime! };
    }
  }

  return null; // Shop never opens
}

/**
 * Get current day's business hours
 */
export function getTodayHours(businessHours: BusinessHourDto[]): BusinessHourDto | null {
  const now = new Date();
  const dayName = getDayName(now);
  return businessHours.find(h => h.day === dayName.toLowerCase()) || null;
}

// Helper functions

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getDayName(date: Date): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
