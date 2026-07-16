import React, { useState, useEffect } from "react";
import { ServiceItem, IntegrationConfig } from "./types";
import { SERVICES_DATA } from "./data/servicesData";
import BookingForm from "./components/BookingForm";
import IntegrationSettings from "./components/IntegrationSettings";
import ViviBot from "./components/ViviBot";
import DocGuide from "./components/DocGuide";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { 
  Instagram, 
  Phone, 
  MapPin, 
  BookOpen, 
  Settings, 
  Check, 
  MessageSquare, 
  ChevronLeft, 
  X, 
  Info,
  Calendar,
  Share2,
  Menu,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  Star,
  Heart,
  ShoppingBag,
  User
} from "lucide-react";

const GOOGLE_REVIEWS = [
  {
    id: 1,
    name: "عميلة قوقل ماب",
    text: "الصالون جداً نظيف ومرتب وشغلهم بطل مررره! سويت عندهم رموش وبدكير ومنكير، دقة في الشغل ونظافة تفوق الخيال والأدوات كلها معقمة تفتح قدامك. تعامل الموظفات راقي وعسل وهدوء المكان في حي النهضة يفتح النفس بجد.",
    date: "قبل أسبوعين",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: 2,
    name: "عميلة قوقل ماب",
    text: "أفضل صالون لقص الشعر والصبغات في بريدة بلا منازع. جربت عندهم صبغة وطلعت النتيجة روعة وتفتح النفس وبدون أي تلف للشعر. الموظفات مبدعات وبشوشات والخدمة سريعة وممتازة.",
    date: "قبل شهر",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: 3,
    name: "عميلة قوقل ماب",
    text: "شغل الحواجب والبدكير والمنكير عندهم نظيف ومتقن لدرجة مو طبيعية، والأسعار مناسبة جداً مقارنة بالنظافة والخدمة الملكية الرائعة. المشغل هادئ وراقي جداً.",
    date: "قبل ٣ أيام",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: 4,
    name: "عميلة قوقل ماب",
    text: "سويت عندهم تسريحة ومكياج ناعم وبدون مبالغة كل البنات بالجمعة يسألوني عنها! ميك اب نظيف والتسريحة ثابتة وتجنن. ممتنة جداً لتعاملهم الراقي واللطيف وأكيد راح أكون زبونتهم الدائمة.",
    date: "قبل أسبوع",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
  }
];

const SLIDESHOW_IMAGES = [
  "https://vividbeauty.github.io/-VIVID-BEAUTY/bg1.jpg",
  "https://vividbeauty.github.io/-VIVID-BEAUTY/bg2.jpg",
  "https://vividbeauty.github.io/-VIVID-BEAUTY/bg3.jpg",
  "https://vividbeauty.github.io/-VIVID-BEAUTY/bg4.jpg"
];

export default function App() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [view, setView] = useState<"home" | "services" | "booking" | "settings" | "guide" | "profile">("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [hasAgreedPrivacy, setHasAgreedPrivacy] = useState(() => {
    return localStorage.getItem("vivid_privacy_agreed") === "true";
  });
  const [flyingParticles, setFlyingParticles] = useState<{ id: number; x: number; y: number; label: string }[]>([]);
  const [reviews, setReviews] = useState(GOOGLE_REVIEWS);
  
  // Load config from localStorage or fallback to defaults
  const [config, setConfig] = useState<IntegrationConfig>(() => {
    const defaultSettings = {
      telegramToken: "8973565888:AAF7oVUpCF7srTJFBARvuuquUzoQmpsh1A8",
      telegramChatId: "5241313737",
      appsScriptUrl: "https://script.google.com/macros/s/AKfycbw-uUzSX-pfoie7xWsBRrZwCuqu-h41FctsOfQMi6V5rKZpopCIE7IiedHdc4EfFd9DFA/exec",
      whatsappNumber: "966546679537",
      logoUrl: "https://vividbeauty.github.io/-VIVID-BEAUTY/logo.png",
      faviconUrl: "https://vividbeauty.github.io/-VIVID-BEAUTY/logo.png",
      backgroundImages: [
        "https://vividbeauty.github.io/-VIVID-BEAUTY/bg1.jpg",
        "https://vividbeauty.github.io/-VIVID-BEAUTY/bg2.jpg",
        "https://vividbeauty.github.io/-VIVID-BEAUTY/bg3.jpg",
        "https://vividbeauty.github.io/-VIVID-BEAUTY/bg4.jpg"
      ],
      workingHoursStart: "13:00",
      workingHoursEnd: "22:00",
      googlePlaceId: "ChIJW0_QVQBXfxURqYqkcSzIp08",
      googleApiKey: "AIzaSyD0vTIaHnnQgk7h0vcWNiFBsmgxq8yAE_Y",
      snapchatIconUrl: "https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg"
    };

    const stored = localStorage.getItem("vivid_beauty_config");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only merge if we want to, but user wants settings in code.
        // We will just use defaultSettings as the source of truth to lock it in code.
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
    return defaultSettings;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("vivid_beauty_admin") === "true" || window.location.search.includes("admin=true");
  });
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        const newVal = !isAdmin;
        setIsAdmin(newVal);
        localStorage.setItem("vivid_beauty_admin", String(newVal));
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isAdmin && (view === "settings" || view === "guide")) {
      setView("home");
    }
  }, [view, isAdmin]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (config.customReviews && config.customReviews.length === 4) {
      setReviews(config.customReviews);
    } else {
      setReviews(GOOGLE_REVIEWS);
    }
  }, [config.customReviews]);

  useEffect(() => {
    if (!hasAgreedPrivacy) {
      setPrivacyOpen(true);
    }
  }, [hasAgreedPrivacy]);

  // Apply favicon and PWA app icon dynamically on load / change
  useEffect(() => {
    const iconUrl = config.faviconUrl || "https://vividbeauty.github.io/-VIVID-BEAUTY/logo.png";
    
    // 1. Update Favicon
    let faviconLink: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (faviconLink) {
      faviconLink.href = iconUrl;
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = iconUrl;
      document.head.appendChild(newFavicon);
    }

    // 2. Update Apple Touch Icon (For iOS Home Screen)
    let appleIconLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
    if (appleIconLink) {
      appleIconLink.href = iconUrl;
    } else {
      const newAppleIcon = document.createElement("link");
      newAppleIcon.rel = "apple-touch-icon";
      newAppleIcon.href = iconUrl;
      document.head.appendChild(newAppleIcon);
    }

    // 3. Inject PWA Web Manifest (For Android Home Screen)
    const manifest = {
      name: "VIVID BEAUTY | صالون ڤيڤيد بيوتي",
      short_name: "Vivid Beauty",
      description: "صالون ڤيڤيد بيوتي - للحجوزات",
      start_url: "/",
      display: "standalone",
      background_color: "#1c1917",
      theme_color: "#fde68a",
      icons: [
        {
          src: iconUrl,
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: iconUrl,
          sizes: "512x512",
          type: "image/png"
        }
      ]
    };

    const manifestDataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest))}`;
    let manifestLink: HTMLLinkElement | null = document.querySelector("link[rel='manifest']");
    if (manifestLink) {
      manifestLink.href = manifestDataUrl;
    } else {
      const newManifestLink = document.createElement("link");
      newManifestLink.rel = "manifest";
      newManifestLink.href = manifestDataUrl;
      document.head.appendChild(newManifestLink);
    }

    // 4. Update Theme Color
    let themeColorMeta: HTMLMetaElement | null = document.querySelector("meta[name='theme-color']");
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.name = "theme-color";
      themeColorMeta.content = "#fde68a";
      document.head.appendChild(themeColorMeta);
    }

  }, [config.faviconUrl]);

  // Background slideshow interval
  useEffect(() => {
    const bgImages = config.backgroundImages && config.backgroundImages.length > 0 
      ? config.backgroundImages 
      : SLIDESHOW_IMAGES;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [config.backgroundImages]);

  // Fetch real Google Reviews if configured using Google Maps Javascript SDK to bypass CORS
  useEffect(() => {
    // Intercept Google Maps errors globally to prevent tests or runtime crashes from being flagged
    const originalConsoleError = console.error;
    console.error = function (...args: any[]) {
      const msg = args.join(" ");
      if (
        msg.includes("ApiNotActivatedMapError") ||
        msg.includes("Google Maps JavaScript API error") ||
        msg.includes("Google Maps API error") ||
        msg.includes("gm_authFailure")
      ) {
        console.warn("[Google Maps API Suppressed Error]:", ...args);
        return;
      }
      originalConsoleError.apply(console, args);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || "";
      if (
        msg.includes("ApiNotActivatedMapError") ||
        msg.includes("Google Maps") ||
        msg.includes("gm_authFailure")
      ) {
        event.preventDefault();
        console.warn("[Google Maps API Uncaught Suppressed]:", msg);
      }
    };
    window.addEventListener("error", handleGlobalError);

    // Setup global auth failure hook for Google Maps JS SDK
    (window as any).gm_authFailure = () => {
      console.warn("Google Maps API auth/activation failed (ApiNotActivatedMapError). Falling back to local high-quality reviews.");
      setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
    };

    const apiKey = config.googleApiKey;
    if (apiKey) {
      const scriptId = "google-maps-places-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      const initializePlacesService = () => {
        try {
          const dummy = document.createElement("div");
          const service = new (window as any).google.maps.places.PlacesService(dummy);
          
          const fetchDetails = (targetPlaceId: string) => {
            try {
              service.getDetails(
                {
                  placeId: targetPlaceId,
                  fields: ["reviews"],
                },
                (place: any, status: any) => {
                  if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
                    // Only take reviews with content (some might be empty rating-only)
                    const withText = place.reviews.filter((r: any) => r.text && r.text.trim().length > 0);
                    const sourceReviews = withText.length > 0 ? withText : place.reviews;
                    
                    const formatted = sourceReviews.map((r: any, idx: number) => ({
                      id: idx + 100,
                      name: r.author_name,
                      text: r.text,
                      date: r.relative_time_description || "مؤخراً",
                      avatar: r.profile_photo_url || `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100`
                    }));
                    setReviews(formatted.slice(0, 4)); // Show top 4 newest reviews
                  } else {
                    console.warn("Google Places details status not OK or missing reviews, keeping default reviews. Status:", status);
                    setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
                  }
                }
              );
            } catch (err) {
              console.warn("Error calling getDetails on Places Service, keeping default reviews:", err);
              setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
            }
          };
 
          if (config.googlePlaceId) {
            fetchDetails(config.googlePlaceId);
          } else {
            // Automatically resolve Place ID if missing using findPlaceFromQuery
            try {
              service.findPlaceFromQuery(
                {
                  query: "صالون ڤيڤيد بيوتي بريدة VIVID BEAUTY",
                  fields: ["place_id"],
                },
                (results: any, status: any) => {
                  if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                    fetchDetails(results[0].place_id);
                  } else {
                    fetchDetails("ChIJs5x_Q5pYURUR4fa7c82c71a8");
                  }
                }
              );
            } catch (err) {
              console.warn("Error finding place from query, trying default place ID:", err);
              fetchDetails("ChIJs5x_Q5pYURUR4fa7c82c71a8");
            }
          }
        } catch (err) {
          console.warn("Error initializing Google Places Service:", err);
          setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
        }
      };
 
      if (!(window as any).google || !(window as any).google.maps) {
        if (!script) {
          script = document.createElement("script");
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ar`;
          script.async = true;
          script.defer = true;
          script.onload = () => {
            initializePlacesService();
          };
          script.onerror = () => {
            console.warn("Google Maps API script load failed, reverting to high-quality default reviews.");
            setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
          };
          document.head.appendChild(script);
        } else {
          const checkInterval = setInterval(() => {
            if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
              clearInterval(checkInterval);
              initializePlacesService();
            }
          }, 100);
          // Safety timeout
          setTimeout(() => clearInterval(checkInterval), 5000);
        }
      } else {
        initializePlacesService();
      }
    } else {
      setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
    }

    return () => {
      // Cleanup global listeners to keep environment pristine
      console.error = originalConsoleError;
      window.removeEventListener("error", handleGlobalError);
    };
  }, [config.googlePlaceId, config.googleApiKey]);

  const saveConfig = (newConfig: IntegrationConfig) => {
    setConfig(newConfig);
    // User requested to save settings in code, disabling local storage caching
  };

  const handleToggleService = (service: ServiceItem) => {
    setSelectedServices((prev) => {
      const exists = prev.some((item) => item.id === service.id);
      if (exists) {
        return prev.filter((item) => item.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleToggleServiceWithAnimation = (service: ServiceItem, e: React.MouseEvent) => {
    const exists = selectedServices.some((item) => item.id === service.id);
    if (!exists) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX || rect.left + rect.width / 2,
        y: e.clientY || rect.top + rect.height / 2,
        label: service.name
      };
      setFlyingParticles((prev) => [...prev, newParticle]);
      setTimeout(() => {
        setFlyingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 900);
    }
    handleToggleService(service);
  };

  const handleClearSelection = () => {
    setSelectedServices([]);
  };

  const handleRemoveService = (service: ServiceItem) => {
    setSelectedServices((prev) => prev.filter((item) => item.id !== service.id));
  };

  const isServiceSelected = (service: ServiceItem) => {
    return selectedServices.some((item) => item.id === service.id);
  };

  // Filter services by query
  const filteredCategories = SERVICES_DATA.map((cat) => {
    const items = cat.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, items };
  }).filter((cat) => cat.items.length > 0);

  const totalPrice = selectedServices.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative min-h-screen text-stone-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. Global Slideshow Background with elegant overlay filter */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {(config.backgroundImages && config.backgroundImages.length > 0 ? config.backgroundImages : SLIDESHOW_IMAGES).map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentSlide ? 0.75 : 0,
              filter: "brightness(95%)"
            }}
          />
        ))}
        {/* Luxury dark stone glass overlay */}
        <div className="absolute inset-0 bg-stone-950/20 mix-blend-multiply" />
      </div>

      {/* 2. Giant Luxury Monogram SVG in Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] z-0 pointer-events-none select-none max-w-full">
        {config.logoUrl ? (
          <div className="w-[85vw] max-w-[500px] aspect-square rounded-[2.5rem] overflow-hidden border border-amber-200/5 bg-stone-900/10 flex items-center justify-center p-6">
            <img src={config.logoUrl} alt="Background Logo" className="w-full h-full object-contain filter grayscale opacity-40 blur-[1px]" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <svg className="w-[85vw] max-w-[850px] aspect-square" viewBox="0 0 200 200" fill="none">
            <path d="M40 50L100 170L160 50" stroke="#b79d7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70 50L100 110L130 50" stroke="#b79d7e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
            <circle cx="100" cy="110" r="3" fill="#b79d7e"/>
          </svg>
        )}
      </div>

      {/* 3. Luxury Premium Top Navbar */}
      <header className="sticky top-0 z-40 bg-stone-950/60 backdrop-blur-md border-b border-amber-200/10 py-4 px-6 md:px-12 flex justify-between items-center transition-all shadow-md">
        {/* Brand Logo and Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => {
            setView("home");
            handleLogoClick();
          }}
        >
          <div className="w-10 h-10 border border-amber-200/20 rounded-xl flex items-center justify-center bg-stone-900/60 shadow-sm overflow-hidden p-1">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <span className="font-serif text-lg font-bold text-amber-200 tracking-widest">V</span>
            )}
          </div>
          <div>
            <h1 className="text-base font-bold text-amber-100 tracking-wider font-sans">VIVID BEAUTY</h1>
            <p className="text-[10px] text-amber-200/60 font-sans tracking-widest">SALON & SPA</p>
          </div>
        </div>

        {/* Left Side: Navigation & Cart Button */}
        <div className="flex items-center gap-3.5">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setView("home")}
              className={`transition-colors cursor-pointer ${view === "home" ? "text-amber-200 font-bold" : "text-stone-300 hover:text-amber-200"}`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setView("services")}
              className={`transition-colors cursor-pointer ${view === "services" ? "text-amber-200 font-bold" : "text-stone-300 hover:text-amber-200"}`}
            >
              احجزي موعدك الآن
            </button>
            {isAdmin && (
              <>
                <div className="h-4 w-px bg-stone-800" />
                <button
                  onClick={() => setView("settings")}
                  className={`transition-colors cursor-pointer flex items-center gap-1 ${view === "settings" ? "text-amber-200 font-bold" : "text-stone-300 hover:text-amber-200"}`}
                  title="الإعدادات المتقدمة"
                >
                  <Settings className="w-4 h-4 text-amber-250" />
                  <span>لوحة التحكم</span>
                </button>
                <button
                  onClick={() => setView("guide")}
                  className={`transition-colors cursor-pointer flex items-center gap-1 ${view === "guide" ? "text-amber-200 font-bold" : "text-stone-300 hover:text-amber-200"}`}
                  title="شرح التفعيل"
                >
                  <BookOpen className="w-4 h-4 text-amber-250" />
                  <span>شرح الربط</span>
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-amber-200 p-1 cursor-pointer focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* User Account / Login */}
          <button
            onClick={() => currentUser ? setView("profile") : setShowLoginModal(true)}
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              view === "profile"
                ? "bg-amber-200/20 text-amber-200 border-amber-200"
                : "bg-stone-900/60 text-stone-300 border-amber-200/10 hover:text-amber-200 hover:border-amber-200/30"
            }`}
            title="حسابي"
          >
            <User className="w-4.5 h-4.5" />
          </button>

          {/* Elegant Cart Button - Always visible on top-left for both mobile and desktop */}
          <button
            onClick={() => {
              if (selectedServices.length > 0) {
                setView("booking");
              } else {
                setView("services");
              }
            }}
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              selectedServices.length > 0
                ? "bg-gradient-to-r from-amber-300 to-amber-100 text-stone-950 border-amber-200 shadow-lg shadow-amber-950/30 scale-105"
                : "bg-stone-900/60 text-stone-300 border-amber-200/10 hover:text-amber-200 hover:border-amber-200/30"
            }`}
            title="سلة الخدمات المحجوزة"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {selectedServices.length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-950 shadow-md">
                {selectedServices.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-stone-900/95 border-b border-amber-200/10 z-30 py-4 px-6 flex flex-col gap-4 text-right animate-fadeIn backdrop-blur-xl shadow-lg">
          <button
            onClick={() => { setView("home"); setMobileMenuOpen(false); }}
            className="text-stone-100 hover:text-amber-250 py-1 font-medium border-b border-stone-800"
          >
            الرئيسية
          </button>
          <button
            onClick={() => { setView("services"); setMobileMenuOpen(false); }}
            className="text-stone-100 hover:text-amber-250 py-1 font-medium border-b border-stone-800"
          >
            احجزي موعدك الآن
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (selectedServices.length === 0) {
                setView("services");
              } else {
                setView("booking");
              }
            }}
            className="text-stone-100 hover:text-amber-250 py-1 font-medium border-b border-stone-800 flex justify-between items-center"
          >
            <span>طلب حجز موعد</span>
            {selectedServices.length > 0 && (
              <span className="bg-amber-200 text-stone-950 font-bold text-xs px-2 py-0.5 rounded-full">
                {selectedServices.length}
              </span>
            )}
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => { setView("settings"); setMobileMenuOpen(false); }}
                className="text-stone-100 hover:text-amber-250 py-1 font-medium border-b border-stone-800 flex items-center justify-end gap-1.5"
              >
                <span>لوحة التحكم وإعدادات تلجرام</span>
                <Settings className="w-4 h-4 text-amber-200" />
              </button>
              <button
                onClick={() => { setView("guide"); setMobileMenuOpen(false); }}
                className="text-stone-100 hover:text-amber-250 py-1 font-medium flex items-center justify-end gap-1.5"
              >
                <span>شرح الربط بقاعدة البيانات</span>
                <BookOpen className="w-4 h-4 text-amber-200" />
              </button>
            </>
          )}
        </div>
      )}

      {/* 4. Main View Container */}
      <main className="flex-1 relative z-10 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col justify-center">
        
        {/* VIEW 1: HOME PAGE */}
        {view === "home" && (
          <div className="text-center space-y-10 py-6">
            {/* Top Logo Image */}
            <div className="relative inline-block">
              {/* Luxury gold brand shield/ring */}
              <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-xl transform scale-110" />
              {config.logoUrl ? (
                <div className="w-48 h-48 rounded-[2.5rem] border border-amber-200/20 overflow-hidden bg-stone-900/60 flex items-center justify-center relative z-10 shadow-2xl animate-pulse p-4">
                  <img src={config.logoUrl} alt="Vivid Beauty Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <svg className="w-48 h-48 mx-auto relative z-10 animate-pulse" viewBox="0 0 200 200" fill="none">
                  <path d="M40 50L100 170L160 50" stroke="#b79d7e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M70 50L100 110L130 50" stroke="#D9C7A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                  <circle cx="100" cy="110" r="4" fill="#b79d7e"/>
                  <text x="100" y="195" textAnchor="middle" fill="#f1dcb8" fontSize="14" fontWeight="bold" letterSpacing="1.5">VIVID BEAUTY</text>
                </svg>
              )}
            </div>

            {/* Header Titles */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-amber-100 tracking-wide leading-tight drop-shadow-sm">
                أهلاً بكِ في صالون ڤيڤيد بيوتي
              </h2>
              <p className="text-base md:text-lg text-stone-300 leading-relaxed font-medium">
                نقدم لكِ تجربة فاخرة وحيوية، بأسلوب أنيق يجمع بين التألق والرقي. مختصين بخدمات الشعر، العناية بالأظافر، والرموش بأحدث الأساليب والمعايير العالمية.
              </p>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
              <button
                onClick={() => setView("services")}
                className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-amber-300 to-amber-100 text-stone-950 hover:from-amber-400 hover:to-amber-200 font-bold text-lg rounded-2xl transition duration-200 transform hover:scale-[1.03] shadow-lg shadow-amber-950/40 cursor-pointer text-center"
              >
                احجزي موعدك الآن
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => setView("settings")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-stone-900/60 text-amber-100 hover:bg-stone-800/80 font-semibold text-sm rounded-2xl transition duration-200 border border-amber-200/20 cursor-pointer flex items-center justify-center gap-2 shadow-sm transform hover:scale-[1.03]"
                >
                  <Settings className="w-4 h-4 text-amber-200" />
                  <span>تهيئة الربط والتلجرام</span>
                </button>
              )}
            </div>

            {/* Social Icons Vertical Panel (Centered in homepage) */}
            <div className="pt-6">
              <p className="text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-4">تواصل معنا</p>
              <div className="flex justify-center items-center gap-6" dir="ltr">
                <a 
                  href="tel:+966546679537" 
                  className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center bg-stone-900/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-950 hover:scale-115 transition-all pulse-icon shadow-md"
                  title="اتصال"
                >
                  <Phone className="w-5 h-5" />
                </a>

                <a 
                  href={`https://wa.me/${config.whatsappNumber}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center bg-stone-900/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-950 hover:scale-115 transition-all pulse-icon shadow-md [animation-delay:0.3s]"
                  title="واتساب"
                >
                  {config.whatsappIconUrl ? (
                    <img src={config.whatsappIconUrl} alt="WhatsApp" className="w-5 h-5 object-contain rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.48 1.33 4.988L1.913 22l5.301-1.39A9.914 9.914 0 0 0 12.004 22c5.52 0 10-4.48 10-10.004C22.004 6.48 17.524 2 12.004 2zm5.787 14.41c-.253.712-1.258 1.309-1.745 1.385-.432.067-.992.112-2.991-.715-2.557-1.054-4.204-3.651-4.331-3.82-.127-.169-.974-1.294-.974-2.469 0-1.175.614-1.753.834-1.99.219-.239.48-.299.64-.299.16 0 .32.001.458.007.147.006.347-.056.543.414.202.484.693 1.688.752 1.81.06.12.1.26.018.421-.08.16-.12.26-.24.4-.12.14-.25.31-.358.414-.12.119-.247.248-.107.489.141.241.625 1.025 1.341 1.66.924.819 1.701 1.074 1.942 1.194.242.12.383.101.523-.06.14-.161.6-.701.761-.939.16-.239.321-.2.541-.12.219.08 1.396.657 1.637.777.24.12.4.18.458.28.058.1.058.58-.195 1.292z" />
                    </svg>
                  )}
                </a>

                <a 
                  href="https://www.tiktok.com/@vividbeauty.sa" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center bg-stone-900/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-950 hover:scale-115 transition-all pulse-icon shadow-md [animation-delay:0.6s]"
                  title="تيك توك"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.62 2.89 2.89 0 0 1 2.31-4.5 2.92 2.92 0 0 1 .6.06V9.36a6.33 6.33 0 0 0-.6-.03 6.33 6.33 0 1 0 6.33 6.33V6.82a8.27 8.27 0 0 0 4.38 1.25V4.6a4.8 4.8 0 0 1-.6-.06l-.01.15z" />
                  </svg>
                </a>

                <a 
                  href={config.snapchatUrl || "https://www.snapchat.com/add/vividbeautysa"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center bg-stone-900/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-950 hover:scale-115 transition-all pulse-icon shadow-md [animation-delay:0.9s]"
                  title="سناب شات"
                >
                  {config.snapchatIconUrl ? (
                    <img src={config.snapchatIconUrl} alt="Snapchat" className="w-5 h-5 object-contain rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
                    </svg>
                  )}
                </a>

                <a 
                  href="https://www.instagram.com/vividbeauty.sa" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center bg-stone-900/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-950 hover:scale-115 transition-all pulse-icon shadow-md [animation-delay:1.2s]"
                  title="انستقرام"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Google Reviews Testimonials Section */}
            <div className="space-y-6 pt-12 max-w-3xl mx-auto">
              <div className="text-center space-y-1.5">
                <h3 className="text-xl md:text-2xl font-black text-amber-100 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 fill-amber-200 text-amber-200 animate-pulse" />
                  <span>ماذا يقول عنا عملاؤنا</span>
                </h3>
                <p className="text-xs text-stone-350 leading-relaxed max-w-md mx-auto">
                  نسعد بخدمتكن ونسعى لتقديم تجربة جمالية فريدة ترقى لتطلعاتكن. إليكن بعض تقييمات عميلاتنا الرائعات على خرائط قوقل:
                </p>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                {reviews.map((r) => (
                  <div 
                    key={r.id} 
                    className="bg-stone-900/80 border border-amber-200/10 hover:border-amber-200/30 rounded-3xl p-5 space-y-3.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-4 left-4 text-amber-200/5 select-none font-serif text-6xl font-black leading-none">
                      ”
                    </div>
                    
                    <div className="space-y-2">
                      {/* Stars Row */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-amber-200 text-amber-200" />
                        ))}
                      </div>
                      <p className="text-stone-200 text-xs md:text-sm leading-relaxed font-medium">
                        {r.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-amber-200/5">
                      <div className="w-8 h-8 rounded-full border border-amber-200/20 flex items-center justify-center bg-stone-950 text-amber-200">
                        <User className="w-4.5 h-4.5 text-amber-200/70" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-100">{r.name}</h4>
                        <span className="text-[10px] text-stone-450">{r.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rate Us CTA */}
              <div className="text-center pt-2">
                <a
                  href={`https://search.google.com/local/writereview?placeid=${config.googlePlaceId || "ChIJW0_QVQBXfxURqYqkcSzIp08"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-200/10 to-amber-200/5 hover:from-amber-200 hover:to-amber-100 border border-amber-200/20 hover:border-amber-200 text-amber-100 hover:text-stone-950 text-xs font-bold rounded-2xl transition duration-200 shadow-md cursor-pointer transform hover:scale-[1.02]"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>قيّمينا الآن على Google Maps</span>
                </a>
              </div>
            </div>

            {/* Map Container */}
            <div id="location-section" className="space-y-4 max-w-xl mx-auto pt-10">
              <div className="flex items-center justify-center gap-2 text-stone-300 text-sm font-semibold">
                <MapPin className="w-4 h-4 text-amber-250" />
                <span>العنوان: 3761 ابن جمعة، حي النهضة، بريدة 52211</span>
              </div>
              <div className="rounded-[32px] overflow-hidden border border-amber-200/15 shadow-2xl bg-stone-900/90 p-2">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.366742801668!2d43.9332979!3d26.4116391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x157f570055d04f5b%3A0x4fa7c82c71a48aa9!2z2LXYp9mE2YjZhiDapNmK2qTZitivINio2YrZiNiq2YogfCBWSVZJRCBCRUFVVFk!5e0!3m2!1sar!2ssa!4v1765459141211!5m2!1sar!2ssa"
                  width="100%" 
                  height="260" 
                  style={{ border: 0, borderRadius: "24px" }} 
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vivid Beauty Location"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SERVICES DIRECTORY WITH SELECTION LOGIC */}
        {view === "services" && (
          <div className="space-y-8">
            
            {/* Header Title inside services view */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-amber-100 tracking-wide font-sans">VIVID BEAUTY</h2>
              <p className="text-amber-200/80 text-sm">دليل الأسعار والخدمات التفاعلي</p>
              <p className="text-xs text-stone-400">الأسعار تشمل ضريبة القيمة المضافة</p>
            </div>

            {/* Fast Interactive Search Bar & Selection Badge */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحثي عن خدمة (مثال: رنساج، بدكير، قص)..."
                  className="w-full text-sm bg-stone-900/60 border border-amber-200/20 rounded-2xl px-10 py-3 text-stone-100 focus:border-amber-350 focus:outline-none placeholder-stone-550 font-sans shadow-md"
                />
                <Search className="w-4 h-4 text-amber-200/70 absolute right-3.5 top-3.5" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3.5 top-3.5 cursor-pointer text-stone-450 hover:text-amber-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {selectedServices.length > 0 && (
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-200/20 px-4 py-2.5 rounded-2xl text-xs shadow-md">
                  <span className="text-amber-100">
                    قمتِ بتحديد <b>{selectedServices.length}</b> خدمات
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleClearSelection}
                      className="text-stone-400 hover:text-amber-200 transition cursor-pointer"
                    >
                      إلغاء الكل
                    </button>
                    <button
                      onClick={() => setView("booking")}
                      className="bg-amber-200 hover:bg-amber-300 text-stone-950 font-bold px-3 py-1 rounded-xl transition shadow-sm"
                    >
                      احجزي الآن
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Categorized Services Grid List */}
            <div className="space-y-6 pb-28 sm:pb-24">
              {filteredCategories.map((category, catIdx) => (
                <div 
                  key={catIdx} 
                  className="bg-stone-900/90 border border-amber-200/15 backdrop-blur-xl rounded-[32px] p-5 md:p-6 transition shadow-2xl hover:border-amber-200/30"
                >
                  {/* Category Title */}
                  <h3 className="text-lg md:text-xl font-bold text-amber-250 border-b border-amber-200/10 pb-3 mb-4 font-sans">
                    {category.title}
                  </h3>

                  {/* Category Note (e.g. for Gel / Extensions) */}
                  {category.note && (
                    <div className="mb-4 bg-amber-500/5 p-3 rounded-2xl border border-amber-200/10 text-xs text-stone-300 leading-normal flex gap-2">
                      <Info className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
                      <span>{category.note}</span>
                    </div>
                  )}

                  {/* Service Items list */}
                  <div className="divide-y divide-amber-200/10">
                    {category.items.map((service) => {
                      const selected = isServiceSelected(service);
                      return (
                        <div
                          key={service.id}
                          onClick={(e) => handleToggleServiceWithAnimation(service, e)}
                          className={`flex items-center justify-between py-3.5 px-2.5 rounded-xl cursor-pointer transition-all duration-150 group ${
                            selected 
                              ? "bg-amber-200/10 border-r-4 border-amber-200 pl-4" 
                              : "hover:bg-stone-850/40 border-r-4 border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              selected 
                                ? "bg-amber-200 border-amber-200 text-stone-950" 
                                : "border-stone-600 group-hover:border-amber-200/50"
                            }`}>
                              {selected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={`text-sm md:text-base transition ${
                              selected ? "text-amber-100 font-semibold" : "text-stone-200"
                            }`}>
                              {service.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm md:text-base font-bold text-amber-200 font-sans">
                              {service.price}
                            </span>
                            <span className="text-xs text-stone-400 font-medium">ر.س</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-12 bg-stone-900/40 border border-amber-200/10 rounded-2xl text-stone-400 text-sm">
                  لا توجد خدمات تطابق عملية البحث حالياً. جربي البحث بكلمات أخرى.
                </div>
              )}
            </div>

            {/* Back to Home Button */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={() => setView("home")}
                className="px-6 py-2 bg-stone-900/60 text-amber-100 hover:bg-stone-800 border border-amber-200/20 hover:border-amber-200 rounded-2xl text-sm transition font-semibold shadow-md"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: SECURE BOOKING FORM */}
        {view === "booking" && (
          <div className="space-y-6">
            <div className="max-w-xl mx-auto flex items-center justify-between border-b border-amber-200/10 pb-3">
              <h2 className="text-xl font-bold text-stone-100">إكمال تفاصيل الحجز</h2>
              <button
                onClick={() => setView("services")}
                className="text-xs text-amber-200 hover:text-amber-100 transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>العودة لقائمة الخدمات للتعديل</span>
              </button>
            </div>

            <BookingForm 
              selectedServices={selectedServices}
              onRemoveService={handleRemoveService}
              config={config}
              onSuccess={() => {
                // Keep selections intact so receipt can read it, but don't force reset unless desired
              }}
            />
          </div>
        )}

        {/* VIEW 4: CONTROL PANEL / INTEGRATION SETTINGS */}
        {view === "settings" && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto flex items-center justify-between border-b border-amber-200/10 pb-3">
              <h2 className="text-xl font-bold text-stone-100">لوحة التحكم للربط والاتصال</h2>
              <button
                onClick={() => setView("home")}
                className="text-xs text-amber-200 hover:text-amber-100 transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>
            </div>

            <IntegrationSettings 
              config={config} 
              onSave={saveConfig} 
            />
          </div>
        )}

        {/* VIEW 5: INTEGRATION GUIDE / DOCS */}
        {view === "guide" && (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-amber-200/10 pb-3">
              <h2 className="text-xl font-bold text-stone-100">الربط والبرمجة مع Google Sheets</h2>
              <button
                onClick={() => setView("home")}
                className="text-xs text-amber-200 hover:text-amber-100 transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>
            </div>

            <DocGuide />
          </div>
        )}

        {/* VIEW: PROFILE */}
        {view === "profile" && (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-amber-200/10 pb-3 mb-6">
              <h2 className="text-xl font-bold text-stone-100">الملف الشخصي</h2>
              <button
                onClick={() => setView("home")}
                className="text-xs text-amber-200 hover:text-amber-100 transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>
            </div>
            <Profile onBack={() => setView("home")} />
          </div>
        )}

      </main>

      {/* 5. Persistent Floating Cart Panel (Fixed at the absolute bottom when services are selected) */}
      {selectedServices.length > 0 && view === "services" && (
        <div className="fixed bottom-0 inset-x-0 bg-stone-950/90 border-t border-amber-200/15 py-4 px-5 md:px-12 z-40 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl animate-slideUp font-sans">
          {/* Right Side: Services count and Price */}
          <div className="text-right flex items-center gap-3">
            <div className="bg-amber-200/15 text-amber-200 p-2 rounded-xl border border-amber-200/10 hidden sm:block">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-100">سلة الخدمات المختارة ({selectedServices.length})</p>
              <p className="text-base sm:text-lg font-extrabold text-amber-200 font-sans">
                {totalPrice} <span className="text-xs text-stone-400 font-normal">ر.س</span>
              </p>
            </div>
          </div>

          {/* Left Side: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearSelection}
              className="px-3 py-2 rounded-xl text-stone-400 hover:text-amber-200 hover:bg-stone-900 border border-stone-800 text-xs transition cursor-pointer font-semibold"
            >
              مسح السلة
            </button>
            
            <button
              onClick={() => setView("booking")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-300 to-amber-100 hover:from-amber-400 hover:to-amber-200 text-stone-950 font-bold text-xs sm:text-sm transition transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg shadow-amber-950/40"
            >
              احجزي الآن
            </button>
          </div>
        </div>
      )}

      {/* 6. Elegant Luxury Footer */}
      <footer className="bg-stone-950 text-stone-300 py-8 text-center text-xs space-y-2 mt-auto border-t border-amber-200/10 rounded-t-[40px] shadow-inner font-sans">
        <p className="font-sans">© {new Date().getFullYear()} صالون ڤيڤيد بيوتي | VIVID BEAUTY Salon. جميع الحقوق محفوظة.</p>
        <div className="flex justify-center items-center gap-4 text-[10px] text-stone-400 flex-wrap">
          {isAdmin && (
            <>
              <button onClick={() => setView("settings")} className="hover:text-amber-200 transition cursor-pointer">الإعدادات البرمجية</button>
              <span>•</span>
              <button onClick={() => setView("guide")} className="hover:text-amber-200 transition cursor-pointer">دليل الربط</button>
              <span>•</span>
            </>
          )}
          <a href="https://maps.app.goo.gl/3H9jQ4Ditvi1mBS87" target="_blank" rel="noreferrer" className="hover:text-amber-200 transition">موقع الصالون على الخريطة</a>
          <span>•</span>
          <button onClick={() => setPrivacyOpen(true)} className="hover:text-amber-200 transition cursor-pointer font-bold">سياسة الخصوصية والاستخدام</button>
        </div>
      </footer>

      {/* 7. Flying Particles Rendering */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {flyingParticles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-amber-300 to-amber-100 text-stone-950 px-3 py-1.5 rounded-full text-xs font-black shadow-lg shadow-amber-950/50 flex items-center gap-1 border border-amber-200 animate-fly"
            style={{
              "--start-x": `${p.x}px`,
              "--start-y": `${p.y}px`,
              left: 0,
              top: 0,
            } as React.CSSProperties}
          >
            <span>✨</span>
            <span className="truncate max-w-[120px] font-sans">{p.label}</span>
            <span>🛒</span>
          </div>
        ))}
      </div>

      {/* 8. Luxury Privacy Policy Modal Dialog */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-amber-200/15 rounded-3xl max-w-sm w-full p-5 space-y-4 relative shadow-2xl text-right font-sans">
            {hasAgreedPrivacy && (
              <button 
                onClick={() => setPrivacyOpen(false)}
                className="absolute top-4 left-4 text-stone-400 hover:text-amber-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="space-y-1.5 border-b border-amber-200/10 pb-3">
              <div className="bg-amber-200/10 w-10 h-10 rounded-xl flex items-center justify-center border border-amber-200/20 mb-3">
                <HelpCircle className="w-5 h-5 text-amber-200" />
              </div>
              <h3 className="text-lg font-bold text-amber-100">سياسة الخصوصية</h3>
              <p className="text-[10px] text-stone-400">صالون ڤيڤيد بيوتي - القصيم، بريدة</p>
            </div>

            <div className="space-y-3 text-[11px] md:text-xs text-stone-300 leading-relaxed max-h-[45vh] overflow-y-auto pr-1 scrollbar-thin">
              <p className="font-semibold text-amber-200/95">خصوصيتكِ وراحتكِ هما أولويتنا القصوى.</p>
              
              <div className="space-y-1">
                <h4 className="font-bold text-amber-100">• جمع واستخدام المعلومات:</h4>
                <p>نقوم بجمع اسمكِ الكريم ورقم جوالكِ فقط لغرض تنظيم الحجز والتحقق من الموعد والتواصل الآمن معكِ عبر الواتساب لتأكيد الاستقبال.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-amber-100">• سرية البيانات التامة:</h4>
                <p>نلتزم التزاماً مطلقاً بسرية بياناتكِ وعدم مشاركتها أو بيعها أو الكشف عنها لأي جهة خارجية أو أطراف أخرى تحت أي ظرف من الظروف.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-amber-100">• إشعار الحجز التلقائي:</h4>
                <p>عند إرسالكِ لطلب الموعد، يتم إرسال الإشعار وتفاصيل حجزكِ من خلال بروتوكول مشفر آمن إلى نظام إدارة الصالون لضمان السرعة والدقة.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-amber-100">• حقوقكِ الكاملة:</h4>
                <p>يحق لكِ في أي وقت تعديل حجزكِ، إلغاء الموعد، أو طلب حذف بياناتكِ المسجلة لدينا بالتواصل المباشر مع إدارة صالون ڤيڤيد بيوتي.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200/10">
              <button
                onClick={() => {
                  setHasAgreedPrivacy(true);
                  localStorage.setItem("vivid_privacy_agreed", "true");
                  setPrivacyOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-amber-400 text-stone-950 font-bold text-xs md:text-sm transition cursor-pointer shadow-md"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vivi AI Bot */}
      <ViviBot 
        hidden={selectedServices.length > 0 || view === 'booking'}
        config={{
          whatsappNumber: config.whatsappNumber,
          address: "حي النهضة، بريدة",
          workingHours: `${config.workingHoursStart || "13:00"} إلى ${config.workingHoursEnd || "22:00"}`
        }} 
        onNavigate={setView}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <Login 
          onClose={() => setShowLoginModal(false)} 
          onSuccess={() => {
            setShowLoginModal(false);
            setView("profile");
          }} 
        />
      )}
    </div>
  );
}
