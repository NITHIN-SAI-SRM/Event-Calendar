import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const recurrenceOptions = [
  { label: 'None', value: 'none' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
];

// Example color categories
const colorOptions = [
  { label: 'Blue', value: '#007bff' },
  { label: 'Green', value: '#28a745' },
  { label: 'Red', value: '#dc3545' },
  { label: 'Orange', value: '#fd7e14' },
  { label: 'Purple', value: '#6f42c1' },
  { label: 'Gray', value: '#6c757d' },
];

const EventModal = ({ date, onClose, onSave, eventData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // datetime will be a JS Date object
  const [datetime, setDatetime] = useState(() => {
    // Default time is currentMonth + 09:00 if new, else eventData.datetime
    if (eventData && eventData.datetime) return new Date(eventData.datetime);
    // else set default time to date + 09:00 AM
    const defaultDate = new Date(date);
    defaultDate.setHours(9, 0, 0, 0);
    return defaultDate;
  });
  const [recurrence, setRecurrence] = useState('none');
  const [customRecurrence, setCustomRecurrence] = useState('');
  const [color, setColor] = useState(colorOptions[0].value);

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || '');
      setDescription(eventData.description || '');
      setDatetime(eventData.datetime ? new Date(eventData.datetime) : new Date(date));
      setRecurrence(eventData.recurrence || 'none');
      setColor(eventData.color || colorOptions[0].value);
      setCustomRecurrence(eventData.customRecurrence || '');
    } else {
      setTitle('');
      setDescription('');
      setDatetime(() => {
        const defaultDate = new Date(date);
        defaultDate.setHours(9, 0, 0, 0);
        return defaultDate;
      });
      setRecurrence('none');
      setColor(colorOptions[0].value);
      setCustomRecurrence('');
    }
  }, [eventData, date]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!datetime) {
      alert('Please select date and time');
      return;
    }
    const eventToSave = {
      title: title.trim(),
      description: description.trim(),
      datetime,
      recurrence,
      customRecurrence: recurrence === 'custom' ? customRecurrence.trim() : '',
      color,
    };
    onSave(eventToSave);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          width: '350px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <h2>{eventData ? 'Edit Event' : 'Add Event'}</h2>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Event title"
          />
        </label>
        <label>
          Date and Time:
          <input
            type="datetime-local"
            value={format(datetime, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setDatetime(new Date(e.target.value))}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
            rows={3}
            placeholder="Event description"
          />
        </label>
        <label>
          Recurrence:
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            {recurrenceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        {recurrence === 'custom' && (
          <label>
            Custom recurrence rule:
            <input
              type="text"
              value={customRecurrence}
              onChange={(e) => setCustomRecurrence(e.target.value)}
              placeholder="e.g., Every 2 days"
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </label>
        )}
        <label>
          Event Color:
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            {colorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{ padding: '8px 12px' }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            {eventData ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
