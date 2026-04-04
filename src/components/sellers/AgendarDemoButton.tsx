'use client';

import { useState, useRef, useEffect } from 'react';

type Step = 'calendar' | 'time';

interface TimeSlot {
  hour: number;
  minute: 0 | 30;
  label: string;
}

const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const DAY_NAMES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

const TIME_SLOTS: TimeSlot[] = [
  { hour: 8, minute: 0, label: '8:00' },
  { hour: 8, minute: 30, label: '8:30' },
  { hour: 9, minute: 0, label: '9:00' },
  { hour: 9, minute: 30, label: '9:30' },
  { hour: 10, minute: 0, label: '10:00' },
  { hour: 10, minute: 30, label: '10:30' },
  { hour: 11, minute: 0, label: '11:00' },
  { hour: 11, minute: 30, label: '11:30' },
  { hour: 14, minute: 0, label: '14:00' },
  { hour: 14, minute: 30, label: '14:30' },
  { hour: 15, minute: 0, label: '15:00' },
  { hour: 15, minute: 30, label: '15:30' },
  { hour: 16, minute: 0, label: '16:00' },
  { hour: 16, minute: 30, label: '16:30' },
];

function formatDateSpanish(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  
  return days;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isBeforeToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isDisabled(date: Date): boolean {
  return isWeekend(date) || isBeforeToday(date);
}

export function AgendarDemoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  
  const timeScrollRef = useRef<HTMLDivElement>(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);

  const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
  const rawDay = new Date(currentMonth.year, currentMonth.month, 1).getDay();
  const firstDayOfWeek = rawDay === 0 ? 6 : rawDay - 1;

  const handleDayClick = (date: Date) => {
    if (isDisabled(date)) return;
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    
    const formattedDate = formatDateSpanish(selectedDate);
    const message = `Hola, quiero agendar una demo de Ecommer para el ${formattedDate} a las ${selectedTime.label}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573148518961?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('calendar');
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const handleTimeScrollUp = () => {
    if (timeScrollRef.current) {
      timeScrollRef.current.scrollBy({ top: -60, behavior: 'smooth' });
    }
  };

  const handleTimeScrollDown = () => {
    if (timeScrollRef.current) {
      timeScrollRef.current.scrollBy({ top: 60, behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endTime = Date.now();
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    const deltaTime = endTime - touchStartTime;
    
    if (Math.abs(deltaY) > 30 && deltaTime < 500) {
      if (deltaY > 0) {
        handleTimeScrollDown();
      } else {
        handleTimeScrollUp();
      }
    }
  };

  useEffect(() => {
    if (step === 'time' && timeScrollRef.current) {
      timeScrollRef.current.scrollTop = 0;
    }
  }, [step]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
        style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
      >
        Agendar una Demo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {step === 'calendar' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Selecciona una fecha
                </h3>
                <p className="text-gray-500 mb-6">
                  Solo disponible de lunes a viernes
                </p>

                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-gray-900 capitalize">
                    {MONTH_NAMES[currentMonth.month]} {currentMonth.year}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_NAMES.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  
                  {daysInMonth.map(date => {
                    const disabled = isDisabled(date);
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDayClick(date)}
                        disabled={disabled}
                        className={`
                          aspect-square rounded-lg text-sm font-medium transition-all
                          ${disabled 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : isSelected
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'time' && selectedDate && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Selecciona una hora
                </h3>
                <p className="text-gray-500 mb-4">
                  {formatDateSpanish(selectedDate)}
                </p>

                <div className="relative mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleTimeScrollUp}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    <div 
                      ref={timeScrollRef}
                      className="h-48 overflow-y-auto scrollbar-hide"
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div className="space-y-2 py-4">
                        {TIME_SLOTS.map((slot, index) => {
                          const isSelected = selectedTime?.label === slot.label;
                          
                          return (
                            <button
                              key={`${slot.hour}:${slot.minute}`}
                              onClick={() => handleTimeSelect(slot)}
                              className={`
                                w-full py-3 px-4 rounded-lg text-lg font-medium transition-all
                                ${isSelected
                                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                                }
                              `}
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleTimeScrollDown}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('calendar')}
                    className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Volver
                  </button>
                  
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedTime}
                    className={`
                      flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
                      ${selectedTime
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Confirmar por WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}