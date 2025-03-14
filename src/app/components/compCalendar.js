'use client'
// pages/calendar.js
import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CompCalendar() {
  const events = [
    {
      title: 'Meeting 1',
      start: new Date(),
      end: new Date(),
    },
    // เพิ่มเหตุการณ์เพิ่มเติมที่นี่
  ];

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Appointment Calendar</h1>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default CompCalendar;