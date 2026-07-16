import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AlertCircle, RefreshCw, CheckCircle, Eye, EyeOff } from 'lucide-react';

const convertArabicToEnglishNumbers = (str: string) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[٠-٩]/g, (w) => arabicNumbers.indexOf(w).toString());
};

interface LoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function Login({ onSuccess, onClose }: LoginProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    if (isSignUp && (!name || !phone)) {
      setError('الرجاء إدخال الاسم ورقم الجوال');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          phone,
          email,
          createdAt: new Date().toISOString()
        });
        // We can optionally send the real Firebase verification link behind the scenes
        try { await sendEmailVerification(userCredential.user); } catch (e) {}
        onSuccess();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('تسجيل الدخول بالبريد الإلكتروني غير مفعل. يرجى تفعيله من لوحة تحكم Firebase.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('البريد الإلكتروني مستخدم مسبقاً. قم بتسجيل الدخول بدلاً من ذلك.');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة. يرجى إدخال 6 أحرف على الأقل.');
      } else {
        setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-stone-900 border border-amber-200/20 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 text-stone-400 hover:text-amber-200 transition-colors"
        >
          ✕
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-amber-100 mb-2">{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
          <p className="text-sm text-stone-400">سجلي دخولك لتسهيل حجوزاتك ومتابعتها</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/20 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">الاسم</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم الكريم"
                    className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-300 focus:outline-none text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">رقم الجوال</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(convertArabicToEnglishNumbers(e.target.value))}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-300 focus:outline-none text-right font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-300 focus:outline-none text-right font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full bg-stone-950/50 border border-stone-800 rounded-xl pl-12 pr-4 py-3 text-stone-100 focus:border-amber-300 focus:outline-none text-right font-mono"
                dir="ltr"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-stone-500 hover:text-amber-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-xl pl-12 pr-4 py-3 text-stone-100 focus:border-amber-300 focus:outline-none text-right font-mono"
                  dir="ltr"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-3.5 text-stone-500 hover:text-amber-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password || (isSignUp && !confirmPassword)}
            className="w-full py-3 rounded-xl bg-amber-200 hover:bg-amber-300 text-stone-950 font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-xs text-stone-400 hover:text-amber-200 transition"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
          </button>
        </div>
      </div>
    </div>
  );
}
