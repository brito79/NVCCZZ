'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin, User, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Event, EventsData } from '@/types.db';





const EventsCalendar = ({ events }: { events: EventsData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter events based on search and filter
// Update the filteredEvents calculation to this:
const filteredEvents = events.data.filter(event => {
    const matchesSearch = searchTerm === '' || 
                         event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterActive || event.isActive;
    return matchesSearch && matchesFilter;
  });

  // Get events for the selected day
  const selectedDayEvents = selectedDate
    ? filteredEvents.filter(event => isSameDay(parseISO(event.startDate), selectedDate))
    : [];

  // Generate days for the current month
  const renderDays = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    return days.map((day, i) => {
      const dayEvents = filteredEvents.filter(event => isSameDay(parseISO(event.startDate), day));
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isSelected = selectedDate && isSameDay(day, selectedDate);

      return (
        <motion.div
          key={i}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`p-2 h-24 border border-gray-700 overflow-hidden cursor-pointer transition-colors 
            ${isCurrentMonth ? 'bg-gray-800/30' : 'bg-gray-900/20 text-gray-500'} 
            ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm ${isSelected ? 'font-bold text-white' : ''}`}>
              {format(day, 'd')}
            </span>
            {dayEvents.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            )}
          </div>
          <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
            {dayEvents.slice(0, 2).map(event => (
              <div key={event.id} className="text-xs p-1 rounded bg-blue-900/30 truncate">
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">Company Events</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`flex items-center px-4 py-2 rounded-lg border ${filterActive ? 'bg-blue-900/30 border-blue-500 text-blue-300' : 'bg-gray-800/50 border-gray-700 text-gray-300'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Active Only
          </button>
        </div>
      </div>

      {/* Calendar controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-700 rounded-lg overflow-hidden mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 bg-gray-800 text-center text-gray-300 font-medium">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      {/* Selected day events */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            Events on {format(selectedDate, 'MMMM do, yyyy')}
          </h3>
          
          {selectedDayEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDayEvents.map(event => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-lg bg-gray-800/30 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                    {event.isActive ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-300">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-900/30 text-red-300">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-3">{event.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {format(parseISO(event.startDate), 'h:mm a')} - {format(parseISO(event.endDate), 'h:mm a')}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      {event.author.firstName} {event.author.lastName}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No events scheduled for this day</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EventsCalendar;