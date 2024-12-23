import React, { useState, useEffect } from 'react';
import { calendarAPI } from '../services/api';
import '../styles/Calendar.css';

// Example roles: 'APPLICANT' vs. others. Adjust as needed for your system.
const WEEKDAYS = ['Pzt', 'Sal', 'Çr', 'Prş', 'Cum', 'Cm', 'Pa'];
const DEFAULT_SLOTS = ['09:00', '11:00', '13:30', '16:00'];

// Helper to get days in month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to figure out which weekday day #1 lands on (0=Sunday, 1=Monday, etc.)
function getStartDay(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const Calendar = ({ role = 'APPLICANT' }) => {
  // We'll let the user navigate months. Start with a default, e.g. October 2024
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(9); // 9 = October

  // **State for selected slots** (applicant can pick up to 3)
  const [selectedSlots, setSelectedSlots] = useState([]);

  // **State for already scheduled slots** (fetched for employees/others)
  // Format: an array of objects: { day: 12, slot: '09:00' }, etc.
  const [scheduledSlots, setScheduledSlots] = useState([]);

  // Optional error or status
  const [error, setError] = useState(null);

  // A simple check if this is an applicant vs. an employee
  // In your code, you might do: isApplicant = (role === 'VISITOR' || role === 'INDIVIDUAL') etc.
  const isApplicant = (role === 'APPLICANT');

  // 1) On mount or month/year change, optionally fetch scheduled data if NOT an applicant
  useEffect(() => {
    // If user is an “employee” (i.e., not applicant), fetch schedules from backend
    if (!isApplicant) {
      (async () => {
        try {
          // This is an example call. Adjust to your actual API shape
          // e.g. /calendar?year=2024&month=10
          const response = await calendarAPI.getSchedules({
            year,
            month: month + 1, // if your endpoint expects 1-based months
            // Possibly also pass role
          });
          setScheduledSlots(parseScheduleData(response.data));
          setError(null);
        } catch (err) {
          if (err.response) {
            setError(`Error: ${err.response.status} - ${err.response.statusText}`);
          } else if (err.request) {
            setError('Error: No response from the server.');
          } else {
            setError(`Error: ${err.message}`);
          }
        }
      })();
    } else {
      // If user is applicant, we reset scheduledSlots to empty or skip fetching
      setScheduledSlots([]);
    }
  }, [isApplicant, year, month]);

  // Helper to parse your backend schedule response into a simpler structure
  // E.g., if your response includes a list of { scheduled_date, start_time }, etc.
  function parseScheduleData(data) {
    // Example: if data is an array of schedules
    // We'll assume each has "scheduled_date" like "2024-10-12"
    // and "start_time" like "09:00:00"
    // We'll produce { day: 12, slot: '09:00' }
    const result = [];
    data.forEach(sch => {
      // parse day from sch.scheduled_date
      // e.g. "2024-10-12".split("-")[2] = "12"
      const dayStr = sch.scheduled_date.split('-')[2];
      const dayNum = parseInt(dayStr, 10);
      // parse slot from sch.start_time
      const slotStr = sch.start_time.slice(0, 5); // "09:00" from "09:00:00"
      result.push({ day: dayNum, slot: slotStr });
    });
    return result;
  }

  // 2) Calculate how many days in the month, etc.
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);
  const offset = (startDay === 0 ? 7 : startDay) - 1; 
  const totalCells = 42; // 6 rows * 7 columns

  // Build array of dayNumbers or null
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - offset + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push(null);
    } else {
      cells.push(dayNumber);
    }
  }

  // Utility: check if day+slot is already scheduled
  const isScheduled = (day, slot) => {
    return scheduledSlots.some(item => item.day === day && item.slot === slot);
  };

  // Utility: check if day+slot is selected by the applicant
  const isSelected = (day, slot) => {
    return selectedSlots.some(item => item.day === day && item.slot === slot);
  };

  // Click handler for time slots
  const handleSlotClick = (day, slot) => {
    if (!day) return; // invalid cell
    // If it's scheduled already, do nothing
    if (isScheduled(day, slot)) return;
    // If not an applicant, do nothing
    if (!isApplicant) return;

    setSelectedSlots(prev => {
      // If already selected, remove it
      const exists = prev.find(item => item.day === day && item.slot === slot);
      if (exists) {
        return prev.filter(item => !(item.day === day && item.slot === slot));
      }
      // If not selected, but we have 3 already, do nothing
      if (prev.length >= 3) {
        alert('You can only select up to 3 slots!');
        return prev;
      }
      // Otherwise add it
      return [...prev, { day, slot }];
    });
  };

  // Navigation
  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
    // If you want to reset selections each time the user navigates, do it here:
    // setSelectedSlots([]);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
    // setSelectedSlots([]);
  };

  const displayedMonthName = MONTH_NAMES_TR[month];

  return (
    <div className="calendar-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Header */}
      <div className="calendar-header">
        <button className="prev-month" onClick={goToPreviousMonth}>&lt;</button>
        <h2>{`${displayedMonthName} ${year}`}</h2>
        <button className="next-month" onClick={goToNextMonth}>&gt;</button>
      </div>

      {/* Weekdays */}
      <div className="weekday-row">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={idx} className="day-cell disabled" />;
          }

          return (
            <div key={idx} className="day-cell">
              <span className="day-number">{day}</span>
              <div className="time-slots">
                {DEFAULT_SLOTS.map(slot => {
                  // If it’s scheduled, mark as "disabled" or “occupied”
                  if (isScheduled(day, slot)) {
                    return (
                      <div key={slot} className="time-slot disabled">
                        {slot}
                      </div>
                    );
                  }

                  // If user is an applicant, let them select
                  const selected = isSelected(day, slot);
                  const slotClass = selected
                    ? 'time-slot selected'
                    : 'time-slot available';

                  return (
                    <div
                      key={slot}
                      className={slotClass}
                      onClick={() => handleSlotClick(day, slot)}
                    >
                      {slot}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
