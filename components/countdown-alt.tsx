import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

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
    <div className="glass-effect rounded-2xl p-6 shadow-elegant animate-fade-in-slow border border-border/30">
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-muted-foreground text-[10px] font-medium tracking-[0.25em] uppercase">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>Countdown</span>
          </div>
          
          <h2 className="font-serif font-semibold text-xl text-foreground">
            {eventName}
          </h2>
          
          <time dateTime={targetDate} className="text-xs text-muted-foreground/70">
            {new Date(targetDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        {/* Countdown Display - Sleek Modern Design */}
        <div className="flex justify-center gap-3" role="timer" aria-live="polite" aria-atomic="true">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="bg-card border border-border/40 rounded-xl w-20 h-20 flex items-center justify-center">
                <div className="text-3xl font-bold text-accent font-mono tabular-nums">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-2 font-medium">
              Days
            </div>
          </div>
          
          <div className="flex items-center pb-5">
            <span className="text-2xl text-muted-foreground/40 font-light">:</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="bg-card border border-border/40 rounded-xl w-20 h-20 flex items-center justify-center">
                <div className="text-3xl font-bold text-accent font-mono tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-2 font-medium">
              Hours
            </div>
          </div>
          
          <div className="flex items-center pb-5">
            <span className="text-2xl text-muted-foreground/40 font-light">:</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="bg-card border border-border/40 rounded-xl w-20 h-20 flex items-center justify-center">
                <div className="text-3xl font-bold text-accent font-mono tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-2 font-medium">
              Minutes
            </div>
          </div>
          
          <div className="flex items-center pb-5">
            <span className="text-2xl text-muted-foreground/40 font-light">:</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="bg-card border border-border/40 rounded-xl w-20 h-20 flex items-center justify-center">
                <div className="text-3xl font-bold text-accent font-mono tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-2 font-medium">
              Seconds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;