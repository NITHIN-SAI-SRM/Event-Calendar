import React, { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  getDate,
  getMonth,
} from 'date-fns';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    color: '#00aaff',
    recurrence: '',
    description: '',
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [showYearMonthView, setShowYearMonthView] = useState(false);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
        <div
          className="header row flex-middle"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#f8f9fa',
            borderBottom: '0px solid #dee2e6',
            borderRadius: '8px',
            fontFamily: 'Segoe UI, sans-serif',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div
            className="col col-start"
            style={{
              cursor: 'pointer',
              color: '#007bff',
              fontWeight: '500',
              fontSize: '16px',
            }}
            onClick={prevMonth}
          >
            &#8592; Previous
          </div>
      
          <div
            className="col col-center"
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#343a40',
            }}
          >
            {format(currentMonth, dateFormat)}
          </div>
      
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={goToToday}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#343a40',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Today
            </button>
      
            <button
              onClick={() => setShowYearMonthView(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#343a40',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Year
            </button>
      
            <button
              onClick={handleScheduleView}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#343a40',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Schedule
            </button>
      
            <div
              className="col col-end"
              onClick={nextMonth}
              style={{
                cursor: 'pointer',
                color: '#007bff',
                fontWeight: '500',
                fontSize: '16px',
              }}
            >
              Next &#8594;
            </div>
          </div>
        </div>
      );
      
  };

  const renderYearMonthView = () => {
    const years = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(
        <div key={year} style={{ marginBottom: '1rem' }}>
          <h3>{year}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Array.from({ length: 12 }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentMonth(new Date(year, i, 1));
                  setShowYearMonthView(false);
                }}
                style={{ padding: '5px 10px' }}
              >
                {format(new Date(year, i, 1), 'MMMM')}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '1rem' }}>
        <button onClick={() => setShowYearMonthView(false)} style={{ marginBottom: '1rem' }}>Back to Calendar</button>
        <h2 style={{ marginBottom: '1rem' }}>Select Year and Month</h2>
        {years}
      </div>
    );
  };
  
  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE'; // Full day name
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="col col-center"
          key={i}
          style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return (
      <div className="days row" style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
        {days}
      </div>
    );
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    setNewEvent({
      title: '',
      datetime: format(day, "yyyy-MM-dd'T'HH:mm"),
      color: '#00aaff',
      recurrence: '',
      description: '',
    });
    setEditingEvent(null);
    setModalOpen(true);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
    setNewEvent({
      title: '',
      datetime: format(today, "yyyy-MM-dd'T'HH:mm"),
      color: '#00aaff',
      recurrence: '',
      description: '',
    });
    setEditingEvent(null);
    setModalOpen(true);
  };


const handleScheduleView = () => {
  const upcoming = events
    .map((evt) => ({
      ...evt,
      datetimeObj: new Date(evt.datetime),
    }))
    .filter((evt) => evt.datetimeObj >= new Date())
    .sort((a, b) => a.datetimeObj - b.datetimeObj);

  if (upcoming.length === 0) {
    alert('No upcoming events');
    return;
  }

  const scheduleList = upcoming
    .map(
      (evt) =>
        `${format(evt.datetimeObj, 'dd MMM yyyy, hh:mm a')} - ${evt.title}${
          evt.description ? ` (${evt.description})` : ''
        }`
    )
    .join('\n');

    alert(`Upcoming Schedule:\n\n${scheduleList}`);

};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.datetime) {
      alert('Please fill title and date/time');
      return;
    }
    const newEventEntry = { ...newEvent, id: Date.now() };
    setEvents([...events, newEventEntry]);
    setModalOpen(false);
  };

  const updateEvent = () => {
    if (!editingEvent.title || !editingEvent.datetime) {
      alert('Please fill title and date/time');
      return;
    }
    setEvents(events.map((evt) => (evt.id === editingEvent.id ? editingEvent : evt)));
    setEditingEvent(null);
    setModalOpen(false);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((evt) => evt.id !== id));
    setModalOpen(false);
    setEditingEvent(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    if (draggedEvent) {
      // Update event datetime to the dropped day but keep the time
      const oldDateTime = new Date(draggedEvent.datetime);
      const newDate = new Date(day);
      newDate.setHours(oldDateTime.getHours());
      newDate.setMinutes(oldDateTime.getMinutes());

      const updatedEvent = { ...draggedEvent, datetime: newDate.toISOString() };
      setEvents(events.map((evt) => (evt.id === draggedEvent.id ? updatedEvent : evt)));
      setDraggedEvent(null);
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Helper: check if event occurs on given day including recurrence
  const eventOccursOnDay = (event, day) => {
    const eventDate = new Date(event.datetime);
    // Normalize times for comparison
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    // If event datetime is exactly the day
    if (isSameDay(eventDate, day)) return true;

    // If event is in future relative to day, it cannot recur on past days
    if (eventDate > dayEnd) return false;

    const recurrence = event.recurrence;

    switch (recurrence) {
      case 'daily':
        // Event recurs every day after eventDate
        return dayStart >= eventDate;
      case 'weekly':
        // Event recurs weekly on same weekday
        return getDay(day) === getDay(eventDate) && dayStart >= eventDate;
      case 'monthly':
        // Event recurs monthly on same date number
        return getDate(day) === getDate(eventDate) && dayStart >= eventDate;
      case 'yearly':
        // Event recurs yearly on same month and date
        return (
          getMonth(day) === getMonth(eventDate) &&
          getDate(day) === getDate(eventDate) &&
          dayStart >= eventDate
        );
      default:
        return false;
    }
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, dateFormat);

        // Filter events that occur on this day considering recurrence
        const dayEvents = events.filter((event) => eventOccursOnDay(event, cloneDay));

        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? 'disabled'
                : isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            key={day.toISOString()}
            onClick={() => onDateClick(cloneDay)}
            onDrop={(e) => handleDrop(e, cloneDay)}
            onDragOver={allowDrop}
            style={{
              flex: 1,
              border: '1px solid #ddd',
              height: '100px',
              padding: '4px',
              overflowY: 'auto',
              position: 'relative',
              backgroundColor: isSameDay(day, selectedDate) ? '#cce5ff' : '',
              color: !isSameMonth(day, monthStart) ? '#ccc' : 'black',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{formattedDate}</div>
            {dayEvents.map((event) => (
              <div
                key={event.id}
                draggable
                onDragStart={(e) => handleDragStart(e, event)}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingEvent(event);
                  setModalOpen(true);
                }}
                title={`${event.title}\n${event.description ? event.description : ''}`}

                style={{
                  backgroundColor: event.color,
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  marginTop: '2px',
                  fontSize: '0.75rem',
                  whiteSpace: 'normal',
                  cursor: 'pointer',
                  maxHeight: '50px',
                  overflow: 'hidden',
                }}
              >
                <strong>{event.title}</strong>
                {event.description && (
                  <div style={{ fontSize: '0.65rem', fontStyle: 'italic', marginTop: 2 }}>
                    {event.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day.toISOString()} style={{ display: 'flex' }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const renderModal = () => {
    if (!modalOpen) return null;

    const eventToEdit = editingEvent ? editingEvent : newEvent;

    return (
      <div
        className="modal"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
        onClick={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Title <br />
              <input
                type="text"
                name="title"
                value={eventToEdit.title}
                onChange={handleInputChange}
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Date & Time <br />
              <input
                type="datetime-local"
                name="datetime"
                value={
                  editingEvent
                    ? format(new Date(editingEvent.datetime), "yyyy-MM-dd'T'HH:mm")
                    : newEvent.datetime
                }
                onChange={handleInputChange}
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Description <br />
              <textarea
                name="description"
                value={eventToEdit.description}
                onChange={handleInputChange}
                rows={3}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Color <br />
              <input
                type="color"
                name="color"
                value={eventToEdit.color}
                onChange={handleInputChange}
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Recurrence <br />
              <select
                name="recurrence"
                value={eventToEdit.recurrence}
                onChange={handleInputChange}
                style={{ width: '100%' }}
              >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {editingEvent && (
              <button
                onClick={() => deleteEvent(editingEvent.id)}
                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                Delete
              </button>
            )}
            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingEvent(null);
                }}
                style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? updateEvent : addEvent}
                style={{ padding: '5px 10px', cursor: 'pointer' }}
              >
                {editingEvent ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar" style={{ maxWidth: '900px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      {showYearMonthView ? renderYearMonthView() : (
        <>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </>
      )}
      {renderModal()}
    </div>
  );
}

export default Calendar;