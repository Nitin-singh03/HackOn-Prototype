import React, { useState, useEffect } from 'react';
import { predictDeliverySlots, generateExampleInput } from '../services/deliveryApi';

const DeliveryDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disclaimer, setDisclaimer] = useState('');

  useEffect(() => {
    // Generate available dates (4 days from current date)
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    setAvailableDates(dates);
  }, []);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setLoading(true);
    setTimeSlots([]);
    setSelectedSlot(null);

    try {
      const inputData = generateExampleInput(date);
      const result = await predictDeliverySlots(inputData);
      
      if (result.success) {
        setTimeSlots(result.recommendations);
        setDisclaimer(result.disclaimer || '');
      }
    } catch (error) {
      console.error('Error fetching delivery slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMostEcoFriendlySlot = () => {
    if (timeSlots.length === 0) return null;
    return timeSlots.reduce((max, slot) => 
      slot.emission_savings_pct > max.emission_savings_pct ? slot : max
    );
  };

  const formatTimeSlot = (slot) => {
    const [start, end] = slot.split('-');
    const startHour = parseInt(start);
    const endHour = parseInt(end);
    
    const formatHour = (hour) => {
      if (hour === 0) return '12:00 AM';
      if (hour < 12) return `${hour}:00 AM`;
      if (hour === 12) return '12:00 PM';
      return `${hour - 12}:00 PM`;
    };
    
    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
  };

  return (
    <div className="delivery-section">
      <h2>Choose your delivery date</h2>
      
      <div className="date-picker">
        {availableDates.map((date, index) => (
          <div
            key={index}
            className={`date-option ${selectedDate && selectedDate.getTime() === date.getTime() ? 'selected' : ''}`}
            onClick={() => handleDateSelect(date)}
          >
            <div className="date-day">{formatDate(date)}</div>
            <div className="date-shipping">FREE delivery</div>
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="time-slots-section">
          <h3>Choose delivery time for {formatDate(selectedDate)}</h3>
          
          {loading ? (
            <div className="loading">Loading available time slots...</div>
          ) : (
            <div className="time-slots">
              {timeSlots.map((slot, index) => {
                const isEcoFriendly = slot === getMostEcoFriendlySlot();
                return (
                  <div
                    key={index}
                    className={`time-slot ${selectedSlot === slot ? 'selected' : ''} ${isEcoFriendly ? 'eco-friendly' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className="slot-header">
                      <div className="slot-time">{formatTimeSlot(slot.slot)}</div>
                      {isEcoFriendly && (
                        <div className="eco-badge">
                          <span className="eco-icon">🌱</span>
                          Most Eco-Friendly
                        </div>
                      )}
                      {slot.is_peak_hour && (
                        <div className="peak-badge">Peak Hours</div>
                      )}
                    </div>
                    <div className="slot-details">
                      <div className="emissions">
                        {slot.emission_savings_pct.toFixed(1)}% emission savings
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {disclaimer && (
            <div className="disclaimer">
              <span className="info-icon">ℹ️</span>
              {disclaimer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryDatePicker;