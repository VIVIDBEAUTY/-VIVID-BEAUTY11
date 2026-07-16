import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, LogOut, Calendar as CalendarIcon, Clock, CheckCircle2, Edit2, Save, X, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchProfileAndData = async () => {
      try {
        // Ensure user document exists
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            phone: '',
            name: '',
            createdAt: new Date().toISOString()
          });
          setProfileData({ name: '', phone: '' });
        } else {
          setProfileData({
            name: userSnap.data().name || '',
            phone: userSnap.data().phone || ''
          });
        }

        // Fetch appointments
        const q = query(
          collection(db, 'appointments'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        apps.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setAppointments(apps);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndData();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name: editName, phone: editPhone });
      setProfileData({ name: editName, phone: editPhone });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return <div className="text-center p-8 text-stone-300">يجب تسجيل الدخول أولاً</div>;
  }

  const now = new Date();
  
  // Categorize based on date and time
  const categorizedApps = appointments.map(app => {
    const appDateTime = new Date(`${app.date}T${app.time}`);
    const isPast = appDateTime < now || app.status === 'completed' || app.status === 'cancelled';
    return { ...app, isPast, dateTime: appDateTime };
  });

  const upcoming = categorizedApps.filter(a => !a.isPast).sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  const past = categorizedApps.filter(a => a.isPast).sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  
  const closestUpcoming = upcoming.length > 0 ? upcoming[0] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6" dir="rtl">
      {/* Profile Header */}
      <div className="bg-stone-900/80 border border-amber-200/15 rounded-[32px] p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-200/20 text-amber-200">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="الاسم"
                  className="bg-stone-950/50 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-100 focus:border-amber-300 focus:outline-none w-full text-sm"
                />
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="رقم الجوال"
                  dir="ltr"
                  className="bg-stone-950/50 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-100 focus:border-amber-300 focus:outline-none w-full text-sm text-right"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-amber-100">{profileData.name || 'مستخدم جديد'}</h2>
                <p className="text-stone-400 text-sm">{profileData.phone || 'لم يتم إضافة رقم الجوال'}</p>
                <p className="text-stone-500 text-xs font-mono" dir="ltr">{user.email}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          {isEditing ? (
            <>
              <button
                onClick={saveProfile}
                className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors bg-stone-950/50 px-3 py-2 rounded-xl text-sm"
              >
                <Save className="w-4 h-4" /> حفظ
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-300 transition-colors bg-stone-950/50 px-3 py-2 rounded-xl text-sm"
              >
                <X className="w-4 h-4" /> إلغاء
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setEditName(profileData.name);
                setEditPhone(profileData.phone);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 text-stone-400 hover:text-amber-200 transition-colors bg-stone-950/50 px-4 py-2 rounded-xl text-sm"
            >
              <Edit2 className="w-4 h-4" /> تعديل
            </button>
          )}
          <button
            onClick={() => auth.signOut().then(() => onBack())}
            className="flex items-center gap-2 text-stone-400 hover:text-red-400 transition-colors bg-stone-950/50 px-4 py-2 rounded-xl text-sm"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-amber-200">جاري تحميل بياناتك...</div>
      ) : (
        <div className="space-y-8">
          {/* Closest Upcoming Appointment Countdown */}
          {closestUpcoming && (
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-200/5 border border-amber-200/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
              <h3 className="text-amber-100 font-bold text-lg mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> موعدك القادم
              </h3>
              <CountdownTimer targetDate={closestUpcoming.dateTime} />
              <div className="mt-4 pt-4 border-t border-amber-200/10 flex justify-between items-center text-sm">
                <span className="text-stone-300">
                  {closestUpcoming.date} - {closestUpcoming.time}
                </span>
                <span className="text-amber-200 font-bold">{closestUpcoming.totalPrice} ر.س</span>
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          <div>
            <h3 className="text-lg font-bold text-amber-100 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> المواعيد الحالية
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-stone-400 text-sm bg-stone-900/40 p-4 rounded-2xl text-center border border-stone-800">
                لا توجد مواعيد حالية.
              </p>
            ) : (
              <div className="grid gap-4">
                {upcoming.map(app => (
                  <AppointmentCard key={app.id} appointment={app} />
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments */}
          {past.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-amber-100/70 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> المواعيد السابقة
              </h3>
              <div className="grid gap-4 opacity-75">
                {past.map(app => (
                  <AppointmentCard key={app.id} appointment={app} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
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

  if (!timeLeft) return <div className="text-amber-200 font-bold">حان موعدك!</div>;

  return (
    <div className="flex gap-4 mt-4" dir="ltr">
      <div className="flex flex-col items-center">
        <div className="bg-stone-950/80 w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xl text-amber-100 border border-amber-200/20">{timeLeft.d}</div>
        <span className="text-[10px] text-stone-400 mt-1">أيام</span>
      </div>
      <div className="text-amber-200/50 font-bold text-xl mt-2">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-stone-950/80 w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xl text-amber-100 border border-amber-200/20">{timeLeft.h.toString().padStart(2, '0')}</div>
        <span className="text-[10px] text-stone-400 mt-1">ساعات</span>
      </div>
      <div className="text-amber-200/50 font-bold text-xl mt-2">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-stone-950/80 w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xl text-amber-100 border border-amber-200/20">{timeLeft.m.toString().padStart(2, '0')}</div>
        <span className="text-[10px] text-stone-400 mt-1">دقائق</span>
      </div>
      <div className="text-amber-200/50 font-bold text-xl mt-2">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-stone-950/80 w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xl text-amber-100 border border-amber-200/20">{timeLeft.s.toString().padStart(2, '0')}</div>
        <span className="text-[10px] text-stone-400 mt-1">ثواني</span>
      </div>
    </div>
  );
};

const AppointmentCard: React.FC<{ appointment: any }> = ({ appointment }) => {
  const [showQr, setShowQr] = useState(false);
  const qrData = JSON.stringify({
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    services: appointment.services?.map((s: any) => s.name),
    totalPrice: appointment.totalPrice
  });

  return (
    <div className="bg-stone-900/60 border border-amber-200/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-amber-200 text-sm font-bold">
          <CalendarIcon className="w-4 h-4" />
          <span>{appointment.date}</span>
          <Clock className="w-4 h-4 ml-1" />
          <span>{appointment.time}</span>
        </div>
        <div className="text-stone-300 text-xs">
          {appointment.services?.map((s: any) => s.name).join(' ، ')}
        </div>
      </div>
      <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
        <div className="flex flex-col items-end">
          <div className="text-amber-100 font-bold">{appointment.totalPrice} ر.س</div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 ${
            appointment.isPast ? (appointment.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300') : 'bg-amber-500/20 text-amber-200'
          }`}>
            {!appointment.isPast ? 'قادم' : appointment.status === 'cancelled' ? 'ملغي' : 'مكتمل'}
          </span>
        </div>
        {!appointment.isPast && appointment.status !== 'cancelled' && (
          <button 
            onClick={() => setShowQr(true)}
            className="p-2 bg-stone-950/50 rounded-xl hover:bg-amber-500/20 hover:text-amber-200 transition-colors border border-stone-800 text-stone-400"
            title="عرض كود الحجز"
          >
            <QrCode className="w-5 h-5" />
          </button>
        )}
      </div>

      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-sm" onClick={() => setShowQr(false)}>
          <div className="bg-stone-900 border border-amber-200/20 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative text-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowQr(false)}
              className="absolute top-4 left-4 text-stone-400 hover:text-amber-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-amber-100 mb-6">رمز تأكيد الحجز</h3>
            <div className="bg-white p-4 rounded-2xl inline-block mb-6">
              <QRCodeSVG value={qrData} size={200} level="H" />
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              يرجى إبراز هذا الرمز لموظفة الاستقبال عند وصولك للصالون لتأكيد حجزك.
            </p>
            <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 text-amber-200/80 text-xs font-mono">
              رقم الحجز: {appointment.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
