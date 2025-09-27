
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleEvent {
  id: number;
  title: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
  startTime: string;
  endTime: string;
  location: string;
  professor: string;
}

interface DaySchedule {
  date: string;
  dayName: string;
  events: ScheduleEvent[];
}

// Générer un horaire pour une semaine
const generateWeekSchedule = (weekOffset: number): DaySchedule[] => {
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const currentDate = new Date();
  
  // Trouver le lundi de la semaine actuelle + offset
  const daysSinceMonday = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  currentDate.setDate(currentDate.getDate() - daysSinceMonday + (weekOffset * 7));
  
  return daysOfWeek.map((day, index) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + index);
    
    // Générer des événements pour ce jour
    const events: ScheduleEvent[] = [];
    const numberOfEvents = Math.floor(Math.random() * 3) + (day === 'Samedi' ? 0 : 1);
    
    for (let i = 0; i < numberOfEvents; i++) {
      const hour = 8 + (i * 2);
      events.push({
        id: date.getTime() + i,
        title: ['Mathématiques', 'Informatique', 'Physique', 'Anglais', 'Histoire de l\'art'][Math.floor(Math.random() * 5)],
        type: ['cours', 'td', 'tp', 'examen'][Math.floor(Math.random() * 4)] as any,
        startTime: `${hour}:00`,
        endTime: `${hour + 2}:00`,
        location: `Salle ${100 + Math.floor(Math.random() * 20)}`,
        professor: `Prof. ${['Dupont', 'Martin', 'Bernard', 'Thomas', 'Robert'][Math.floor(Math.random() * 5)]}`
      });
    }
    
    return {
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      dayName: day,
      events
    };
  });
};

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentSemester, setCurrentSemester] = useState('1');
  
  const weekSchedule = generateWeekSchedule(currentWeek);
  
  const previousWeek = () => setCurrentWeek(prev => prev - 1);
  const nextWeek = () => setCurrentWeek(prev => prev + 1);
  const currentWeekLabel = currentWeek === 0 ? 'Cette semaine' : currentWeek === 1 ? 'Semaine prochaine' : `Semaine ${Math.abs(currentWeek)}`;
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar />
      
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-2xl font-bold text-blue-800 mb-4 md:mb-0">Emploi du temps</h1>
            
            <div className="flex space-x-4">
              <Select value={currentSemester} onValueChange={setCurrentSemester}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                  <SelectItem value="3">Semestre 3</SelectItem>
                  <SelectItem value="4">Semestre 4</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={previousWeek}>
                  <ChevronLeft size={18} />
                </Button>
                <span className="text-sm w-28 text-center font-medium">{currentWeekLabel}</span>
                <Button variant="outline" size="icon" onClick={nextWeek}>
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weekSchedule.map((day) => (
              <Card key={day.dayName} className="overflow-hidden">
                <div className="bg-blue-700 text-white p-3">
                  <h3 className="font-medium">{day.dayName}</h3>
                  <p className="text-sm text-blue-100">{day.date}</p>
                </div>
                <CardContent className="p-4">
                  {day.events.length > 0 ? (
                    <div className="space-y-3">
                      {day.events.map((event) => (
                        <div key={event.id} className={`p-3 rounded-md ${
                          event.type === 'cours' ? 'bg-blue-50 border-l-4 border-blue-600' : 
                          event.type === 'td' ? 'bg-green-50 border-l-4 border-green-600' : 
                          event.type === 'tp' ? 'bg-purple-50 border-l-4 border-purple-600' : 
                          'bg-amber-50 border-l-4 border-amber-600'
                        }`}>
                          <div className="flex justify-between">
                            <h4 className="font-medium">{event.title}</h4>
                            <span className={`text-xs py-1 px-2 rounded ${
                              event.type === 'cours' ? 'bg-blue-100 text-blue-800' : 
                              event.type === 'td' ? 'bg-green-100 text-green-800' : 
                              event.type === 'tp' ? 'bg-purple-100 text-purple-800' : 
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {event.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{event.startTime} - {event.endTime}</p>
                          <p className="text-sm text-gray-500">{event.location}</p>
                          <p className="text-sm text-gray-500">{event.professor}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-400">Aucun cours prévu</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
