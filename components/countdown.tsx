"use client"

import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CountdownProps {
  targetDate: string;
  eventName: string;
}

const Countdown = ({ targetDate, eventName }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <Card className="p-6 shadow-soft animate-fade-in bg-secondary/30 border-accent/20">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-accent" aria-hidden="true" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-serif font-bold text-lg mb-1">Upcoming Memorial</h3>
            <p className="text-sm text-muted-foreground">{eventName}</p>
          </div>

          {/* Countdown Display */}
          <div className="grid grid-cols-4 gap-3" role="timer" aria-live="polite" aria-atomic="true">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {timeLeft.days}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Days
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {timeLeft.hours}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Hours
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {timeLeft.minutes}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Minutes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {timeLeft.seconds}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Seconds
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <time dateTime={targetDate}>
              {new Date(targetDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Countdown;
