import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, Sparkles, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Ticket({ ticketId }: { ticketId: string }) {
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const docRef = doc(db, 'appointments', ticketId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAppointment({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('لم يتم العثور على معلومات الحجز. قد يكون الرمز غير صالح.');
        }
      } catch (err) {
        console.error(err);
        setError('حدث خطأ أثناء جلب تفاصيل الحجز.');
      } finally {
        setLoading(false);
      }
    };
    
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-200/20 border-t-amber-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 text-center">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-200 mb-2">عذراً!</h2>
          <p className="text-stone-400">{error}</p>
        </div>
      </div>
    );
  }

  const targetDateStr = `${appointment.date}T${appointment.time}:00`;
  const targetDate = new Date(targetDateStr);

  return (
    <div className="min-h-screen bg-[#1a1815] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden" dir="rtl">
      {/* Luxury Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-700/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-b from-stone-900 to-[#1c1916] rounded-[2rem] border border-amber-200/20 overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Header */}
          <div className="bg-[#24201c] p-6 text-center relative border-b border-amber-200/10">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
            <h1 className="text-xl font-bold text-amber-200">
              تذكرة الموعد
            </h1>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-8 bg-green-500/10 text-green-400 py-2 px-4 rounded-full w-max mx-auto border border-green-500/20">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold">حجز مؤكد</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between pb-6 border-b border-stone-800">
                <div>
                  <p className="text-stone-400 text-xs mb-1">الخدمات</p>
                  <p className="text-amber-50 font-medium text-sm leading-relaxed">
                    {appointment.services?.map((s: any) => s.name).join(' • ')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-stone-800">
                <div>
                  <p className="text-stone-400 text-xs mb-1 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> التاريخ</p>
                  <p className="text-amber-50 font-bold text-lg">{appointment.date}</p>
                </div>
                <div>
                  <p className="text-stone-400 text-xs mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> الوقت</p>
                  <p className="text-amber-50 font-bold text-lg">{appointment.time}</p>
                </div>
              </div>

              <div>
                <p className="text-stone-400 text-xs mb-1 text-center">الوقت المتبقي</p>
                <TicketCountdown targetDate={targetDate} />
              </div>
            </div>
          </div>

          {/* Footer & QR */}
          <div className="bg-[#1c1916] p-8 text-center border-t border-dashed border-stone-700 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#1a1815] rounded-full border border-stone-700"></div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#1a1815] rounded-full border border-stone-700"></div>
            
            <div className="bg-white p-3 rounded-2xl inline-block mb-4 shadow-lg">
              <QRCodeSVG value={window.location.origin + '?ticket=' + appointment.id} size={120} level="H" />
            </div>
            
            <p className="text-stone-500 text-[10px] font-mono tracking-widest uppercase">
              ID: {appointment.id.slice(0, 12)}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

const TicketCountdown: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({ d, h, m, s });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="text-center text-amber-300 font-bold mt-2">حان وقت الموعد! نتمنى لك تجربة رائعة.</div>;
  }

  return (
    <div className="flex justify-center gap-3 md:gap-4 mt-3" dir="ltr">
      <div className="flex flex-col items-center">
        <div className="bg-stone-900 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl md:text-2xl text-amber-200 border border-amber-200/20 shadow-inner">{timeLeft.d}</div>
        <span className="text-[10px] text-stone-400 mt-2">أيام</span>
      </div>
      <div className="text-amber-200/30 font-bold text-xl mt-3">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-stone-900 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl md:text-2xl text-amber-200 border border-amber-200/20 shadow-inner">{timeLeft.h.toString().padStart(2, '0')}</div>
        <span className="text-[10px] text-stone-400 mt-2">ساعات</span>
      </div>
      <div className="text-amber-200/30 font-bold text-xl mt-3">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-stone-900 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl md:text-2xl text-amber-200 border border-amber-200/20 shadow-inner">{timeLeft.m.toString().padStart(2, '0')}</div>
        <span className="text-[10px] text-stone-400 mt-2">دقيقة</span>
      </div>
      <div className="text-amber-200/30 font-bold text-xl mt-3">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-stone-900 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl md:text-2xl text-amber-200 border border-amber-200/20 shadow-inner">{timeLeft.s.toString().padStart(2, '0')}</div>
        <span className="text-[10px] text-stone-400 mt-2">ثانية</span>
      </div>
    </div>
  );
};
