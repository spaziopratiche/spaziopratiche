import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  FileText, 
  Home, 
  Building2, 
  Zap, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Shield,
  Users,
  Award,
  Menu,
  X,
  Calendar,
  LogIn,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// =====================
// AUTH CONTEXT
// =====================
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post(`${API}/auth/login`, { username, password });
    localStorage.setItem('token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const register = async (data) => {
    const res = await axios.post(`${API}/auth/register`, data);
    return res.data;
  };

  return { user, token, loading, login, logout, register };
};

// =====================
// ANIMATED COUNTER
// =====================
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// =====================
// NAVIGATION
// =====================
const Navigation = ({ onOpenBooking, user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold tracking-tight ${isScrolled ? "text-slate-900" : "text-white"}`}>
              spazio<span className="text-sky-500">pratiche</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Servizi", "Processo", "Prezzi", "Contatti"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-sm font-medium transition-colors hover:text-sky-500 ${isScrolled ? "text-slate-600" : "text-white/90"}`}
              >
                {item}
              </button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  onClick={onOpenBooking}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Prenota
                </Button>
                <button
                  onClick={onLogout}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-sky-500 ${isScrolled ? "text-slate-600" : "text-white/90"}`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-slate-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-slate-900" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl p-6 mb-4">
            {["Servizi", "Processo", "Prezzi", "Contatti"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left py-3 text-slate-600 font-medium hover:text-sky-500"
              >
                {item}
              </button>
            ))}
            <Button 
              onClick={() => { onOpenBooking(); setIsMobileMenuOpen(false); }}
              className={`w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full ${!user ? 'hidden' : ''}`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Prenota Appuntamento
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

// =====================
// BOOKING MODAL
// =====================
const BookingModal = ({ isOpen, onClose, user, onLogin, onLogout, onRegister, token }) => {
  const [view, setView] = useState(user ? 'calendar' : 'login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    first_name: '', last_name: '', email: '',
    agency_name: '', agency_address: '',
    partita_iva: '', sede_legale: '', codice_univoco: '',
    username: '', password: '', confirmPassword: ''
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    appointment_address: '',
    contact_person: '',
    contact_phone: '',
    intercom_name: ''
  });

  useEffect(() => {
    if (user) {
      setView('calendar');
      fetchMyAppointments();
    } else {
      setView('login');
    }
  }, [user]);

  const fetchMyAppointments = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyAppointments(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAvailability = async (date) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/appointments/availability/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailability(res.data);
    } catch (e) {
      toast.error("Errore nel caricamento disponibilità");
    }
    setLoading(false);
  };

  const handleDateSelect = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    fetchAvailability(dateStr);
  };

  const handleBookSlot = async (time) => {
    if (!selectedDate || !token) return;
    
    // Validate required fields
    if (!bookingForm.appointment_address || !bookingForm.contact_person || !bookingForm.contact_phone) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API}/appointments`, {
        date: selectedDate,
        time: time,
        appointment_address: bookingForm.appointment_address,
        contact_person: bookingForm.contact_person,
        contact_phone: bookingForm.contact_phone,
        intercom_name: bookingForm.intercom_name || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Slot bloccato! Riceverai una email di conferma a breve.");
      setBookingForm({ appointment_address: '', contact_person: '', contact_phone: '', intercom_name: '' });
      setSelectedTime(null);
      fetchAvailability(selectedDate);
      fetchMyAppointments();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Errore nella prenotazione");
    }
    setLoading(false);
  };

  const handleCancelAppointment = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${API}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Appuntamento cancellato");
      fetchMyAppointments();
      if (selectedDate) fetchAvailability(selectedDate);
    } catch (e) {
      toast.error("Errore nella cancellazione");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(loginData.username, loginData.password);
      toast.success("Accesso effettuato!");
      setView('calendar');
    } catch (e) {
      toast.error(e.response?.data?.detail || "Credenziali non valide");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }
    setLoading(true);
    try {
      await onRegister(registerData);
      toast.success("Registrazione completata! Ora puoi accedere.");
      setView('login');
      setLoginData({ username: registerData.username, password: '' });
    } catch (e) {
      toast.error(e.response?.data?.detail || "Errore nella registrazione");
    }
    setLoading(false);
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isWeekend = (date) => date && (date.getDay() === 0 || date.getDay() === 6);
  const isPast = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {user ? `Ciao, ${user.first_name}!` : 'Area Clienti'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* LOGIN VIEW */}
          {view === 'login' && !user && (
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Accedi</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <Input
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="Il tuo username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <Input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="La tua password"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 rounded-full">
                  {loading ? "Accesso..." : "Accedi"}
                </Button>
              </form>
              <p className="text-center mt-6 text-slate-600">
                Non hai un account?{' '}
                <button onClick={() => setView('register')} className="text-sky-500 font-semibold hover:underline">
                  Registrati
                </button>
              </p>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && !user && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Registra la tua Agenzia</h3>
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Referente */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Dati Referente
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                      <Input
                        value={registerData.first_name}
                        onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cognome *</label>
                      <Input
                        value={registerData.last_name}
                        onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                      <Input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Agenzia */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Dati Agenzia
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome Agenzia *</label>
                      <Input
                        value={registerData.agency_name}
                        onChange={(e) => setRegisterData({...registerData, agency_name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sede Agenzia *</label>
                      <Input
                        value={registerData.agency_address}
                        onChange={(e) => setRegisterData({...registerData, agency_address: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Fatturazione */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Dati Fatturazione
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Partita IVA *</label>
                      <Input
                        value={registerData.partita_iva}
                        onChange={(e) => setRegisterData({...registerData, partita_iva: e.target.value})}
                        maxLength={11}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Codice Univoco *</label>
                      <Input
                        value={registerData.codice_univoco}
                        onChange={(e) => setRegisterData({...registerData, codice_univoco: e.target.value.toUpperCase()})}
                        maxLength={7}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sede Legale *</label>
                      <Input
                        value={registerData.sede_legale}
                        onChange={(e) => setRegisterData({...registerData, sede_legale: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Credenziali */}
                <div className="bg-sky-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Credenziali di Accesso
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                      <Input
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                      <Input
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Conferma Password *</label>
                      <Input
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 rounded-full py-6">
                  {loading ? "Registrazione..." : "Completa Registrazione"}
                </Button>
              </form>
              <p className="text-center mt-6 text-slate-600">
                Hai già un account?{' '}
                <button onClick={() => setView('login')} className="text-sky-500 font-semibold hover:underline">
                  Accedi
                </button>
              </p>
            </div>
          )}

          {/* CALENDAR VIEW */}
          {user && view === 'calendar' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-slate-100 rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-lg">
                    {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-slate-100 rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, i) => {
                    const isDisabled = !date || isWeekend(date) || isPast(date);
                    const isSelected = date && selectedDate === date.toISOString().split('T')[0];
                    
                    return (
                      <button
                        key={i}
                        onClick={() => date && !isDisabled && handleDateSelect(date)}
                        disabled={isDisabled}
                        className={`
                          aspect-square rounded-lg text-sm font-medium transition-all
                          ${!date ? 'invisible' : ''}
                          ${isDisabled ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-sky-100 text-slate-700'}
                          ${isSelected ? 'bg-sky-500 text-white hover:bg-sky-600' : ''}
                        `}
                      >
                        {date?.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* My Appointments */}
                {myAppointments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-900 mb-3">I tuoi appuntamenti</h4>
                    <div className="space-y-2">
                      {myAppointments.map(apt => (
                        <div key={apt.id} className={`flex items-center justify-between rounded-lg p-3 ${
                          apt.status === 'confirmed' ? 'bg-green-50' : 
                          apt.status === 'pending' ? 'bg-yellow-50' : 'bg-slate-50'
                        }`}>
                          <div>
                            <p className="font-medium text-slate-900">{formatDate(apt.date)}</p>
                            <p className="text-sm text-slate-600">{apt.time} - {apt.duration_minutes} min</p>
                            {apt.status === 'pending' && (
                              <span className="inline-block mt-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                                ⏳ In attesa di conferma
                              </span>
                            )}
                            {apt.status === 'confirmed' && (
                              <span className="inline-block mt-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                ✓ Confermato
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Cancella
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Slots */}
              <div>
                {selectedDate ? (
                  <>
                    <h3 className="font-semibold text-lg mb-4">
                      Orari disponibili - {formatDate(selectedDate)}
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-8 text-slate-500">Caricamento...</div>
                    ) : availability?.slots?.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {availability.slots.map(slot => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`
                                py-3 rounded-lg text-sm font-medium transition-all
                                ${slot.available 
                                  ? selectedTime === slot.time
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'}
                              `}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                        
                        {/* Booking Form - shows when time is selected */}
                        {selectedTime && (
                          <div className="bg-sky-50 rounded-xl p-4 space-y-4">
                            <h4 className="font-semibold text-slate-900">
                              Prenota per le {selectedTime}
                            </h4>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Indirizzo appuntamento *
                              </label>
                              <Input
                                value={bookingForm.appointment_address}
                                onChange={(e) => setBookingForm({...bookingForm, appointment_address: e.target.value})}
                                placeholder="Via, numero civico, città"
                                className="bg-white"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Chi sarà presente *
                              </label>
                              <Input
                                value={bookingForm.contact_person}
                                onChange={(e) => setBookingForm({...bookingForm, contact_person: e.target.value})}
                                placeholder="Nome e cognome"
                                className="bg-white"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Telefono emergenza *
                              </label>
                              <Input
                                value={bookingForm.contact_phone}
                                onChange={(e) => setBookingForm({...bookingForm, contact_phone: e.target.value})}
                                placeholder="+39 ..."
                                className="bg-white"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Citofono (opzionale)
                              </label>
                              <Input
                                value={bookingForm.intercom_name}
                                onChange={(e) => setBookingForm({...bookingForm, intercom_name: e.target.value})}
                                placeholder="Nome sul citofono"
                                className="bg-white"
                              />
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <Button
                                onClick={() => handleBookSlot(selectedTime)}
                                disabled={loading}
                                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white rounded-full"
                              >
                                {loading ? "Prenotazione..." : "Conferma Prenotazione"}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedTime(null)}
                                className="rounded-full"
                              >
                                Annulla
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        Nessun orario disponibile per questa data
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Seleziona una data dal calendario</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Logout button for logged users */}
          {user && (
            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Connesso come <strong>{user.agency_name}</strong>
              </p>
              <Button variant="outline" onClick={onLogout} className="rounded-full">
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================
// HERO SECTION
// =====================
const HeroSection = () => {
  const scrollToContatti = () => {
    document.getElementById("contatti")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400 rounded-full filter blur-3xl opacity-30" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/80 text-sm font-medium">Oltre 10 anni di esperienza nel settore</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Concentrati sulla vendita.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            La burocrazia è il nostro mondo.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12">
          Concentrati sulla vendita, alle pratiche pensiamo noi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={scrollToContatti}
            size="lg" 
            className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-6 text-lg font-semibold group"
            data-testid="hero-cta-button"
          >
            Inizia Ora
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById("servizi")?.scrollIntoView({ behavior: "smooth" })}
            className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
          >
            Scopri i Servizi
          </Button>
        </div>
      </div>
    </section>
  );
};

// =====================
// SERVICES SECTION
// =====================
const ServicesSection = () => {
  const services = [
    {
      icon: Home,
      title: "Annuncio Immobiliare",
      description: "Rilievo degli immobili appena acquisiti con ridisegno della planimetria allo stato attuale, segnalando eventuali difformità rispetto alla scheda catastale.",
      highlight: "TopSeller"
    },
    {
      icon: FileText,
      title: "Pratiche Urbanistiche",
      description: "Preparazione di tutte le pratiche edilizie, anche in sanatoria, per garantire il conseguimento della conformità urbanistica.",
      highlight: null
    },
    {
      icon: Building2,
      title: "Aggiornamenti Catastali",
      description: "Aggiornamento delle schede catastali a seguito della presentazione di una pratica o correzione di errori in visura.",
      highlight: null
    },
    {
      icon: Zap,
      title: "Certificazioni Energetiche",
      description: "Preparazione degli Attestati APE per tutti gli immobili che andranno sul mercato.",
      highlight: "48h"
    },
    {
      icon: Search,
      title: "Visure e Accesso agli Atti",
      description: "Fornitura di Schede Catastali, Visure e richieste di Accesso agli Atti con tutto il materiale rinvenuto.",
      highlight: null
    }
  ];

  return (
    <section id="servizi" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-sky-500 font-semibold text-sm tracking-wider uppercase mb-4 block">I Nostri Servizi</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Tutto ciò di cui hai bisogno per arrivare al rogito senza problemi.
          </h2>
          <p className="text-lg text-slate-600">
            La nostra attività si concentra su una gamma completa di servizi legati alla compravendita e alla locazione di immobili.
          </p>
        </div>

        <div className="space-y-0 divide-y divide-slate-200">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center hover:bg-slate-50 transition-colors -mx-6 px-6 lg:-mx-8 lg:px-8 cursor-pointer"
              data-testid={`service-item-${index}`}
            >
              <div className="lg:col-span-1 flex items-center">
                <span className="text-slate-300 font-bold text-2xl">0{index + 1}</span>
              </div>
              
              <div className="lg:col-span-3 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                  <service.icon className="h-6 w-6 text-sky-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {service.title}
                  </h3>
                  {service.highlight && (
                    <span className="inline-block mt-1 text-xs font-bold text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full">
                      {service.highlight}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-7 flex items-center justify-between">
                <p className="text-slate-600 max-w-xl">{service.description}</p>
                <ArrowRight className="h-6 w-6 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-2 transition-all hidden lg:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================
// PROCESS SECTION
// =====================
const ProcessSection = () => {
  const steps = [
    { number: "01", title: "Contatto", description: "Hai deciso di contattarci perché ti serve supporto?" },
    { number: "02", title: "Verifica", description: "Verifichiamo i documenti a disposizione e definiamo il lavoro" },
    { number: "03", title: "Sopralluogo", description: "Contattiamo il proprietario e fissiamo il sopralluogo" },
    { number: "04", title: "Elaborazione", description: "I nostri tecnici preparano le tavole e impostano la pratica" },
    { number: "05", title: "Consegna", description: "Consegniamo la documentazione secondo le modalità stabilite" }
  ];

  return (
    <section id="processo" className="py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sky-500 font-semibold text-sm tracking-wider uppercase mb-4 block">Come Funziona</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Dal problema alla soluzione in 5 semplici passi.
            </h2>
            <p className="text-lg text-slate-600">
              Durante tutto il processo sarà nostra cura mantenere con il proprietario la massima riservatezza in relazione agli accordi economici e di incarico presi con l'agenzia di riferimento.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500 via-sky-300 to-transparent" />
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-6 group" data-testid={`process-step-${index}`}>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center font-bold text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-lg">
                    {step.number}
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// =====================
// STATS SECTION
// =====================
const StatsSection = () => {
  const stats = [
    { value: 1250, suffix: "+", label: "Pratiche Edilizie" },
    { value: 3220, suffix: "+", label: "Certificazioni Energetiche" },
    { value: 28, suffix: "+", label: "Partnership Attive" },
    { value: 10, suffix: "+", label: "Anni nel Settore" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 to-sky-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">I nostri numeri parlano chiaro</h2>
          <p className="text-white/70">Risultati concreti che dimostrano il nostro impegno</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className="text-4xl lg:text-6xl font-bold text-white mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/70 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================
// WHY US SECTION
// =====================
const WhyUsSection = () => {
  const reasons = [
    { icon: Clock, title: "CILA in Sanatoria in meno di 3gg", description: "Tempi rapidissimi per le tue pratiche urgenti" },
    { icon: Zap, title: "APE pronte entro 48h", description: "Certificazioni energetiche in tempi record" },
    { icon: Shield, title: "Prezzi all-inclusive", description: "Nessuna sorpresa, nessun costo nascosto" },
    { icon: Users, title: "Team di Architetti dedicato", description: "Professionisti sempre a tua disposizione" },
    { icon: MapPin, title: "Sede fisica", description: "Vieni a trovarci per ogni chiarimento" },
    { icon: Award, title: "Soluzioni a pacchetto", description: "Risparmio garantito e quantificato" }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-sky-500 font-semibold text-sm tracking-wider uppercase mb-4 block">Perché Sceglierci</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            La scelta migliore per le tue pratiche.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {reasons.map((reason, index) => (
            <div key={index} className="flex gap-4 group" data-testid={`reason-${index}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                <reason.icon className="h-6 w-6 text-sky-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{reason.title}</h3>
                <p className="text-slate-600">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================
// PRICING SECTION
// =====================
const PricingSection = () => {
  return (
    <section id="prezzi" className="py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sky-500 font-semibold text-sm tracking-wider uppercase mb-4 block">Offerte</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Pacchetti personalizzati per ogni esigenza.
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Offriamo soluzioni convenienti e trasparenti per semplificare la gestione della burocrazia. 
              I nostri pacchetti ti permetteranno di risparmiare tempo e risorse.
            </p>
            <Button 
              onClick={() => document.getElementById("contatti")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8"
            >
              Richiedi un Preventivo Personalizzato
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl opacity-20 blur-xl" />
            <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-100">
              <div className="inline-block bg-sky-500 text-white text-sm font-bold px-4 py-1 rounded-full mb-6">
                Esempio di Combo Unica
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pratica + Catasto + APE</h3>
              <p className="text-slate-600 mb-8">Il pacchetto completo per portare il tuo immobile al rogito senza pensieri.</p>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-bold text-slate-900">€1.100</span>
                <span className="text-slate-500">+ IVA</span>
              </div>

              <ul className="space-y-4 mb-8">
                {["Pratica edilizia completa", "Aggiornamento catastale", "Certificazione APE", "Supporto dedicato"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// =====================
// CONTACT SECTION
// =====================
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      toast.error("Per favore compila tutti i campi obbligatori");
      return;
    }

    if (formData.message.length < 10) {
      toast.error("Il messaggio deve essere di almeno 10 caratteri");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/contact`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      }
    } catch (error) {
      toast.error("Errore nell'invio. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contatti" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-sky-500 font-semibold text-sm tracking-wider uppercase mb-4 block">Contattaci</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Sei pronto a massimizzare la tua produttività?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Compila il form e ti ricontatteremo entro 24 ore lavorative. 
              Siamo qui per semplificare la tua gestione burocratica.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Telefono</p>
                  <p className="font-semibold text-slate-900">338/4071025</p>
                  <p className="font-semibold text-slate-900">334/7077175</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900">info@spaziopratiche.it</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Sede</p>
                  <p className="font-semibold text-slate-900">Via Belfiore 9, 20149 Milano</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Il tuo nome"
                    className="rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-500"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@esempio.it"
                    className="rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-500"
                    data-testid="contact-email-input"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Telefono</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+39 ..."
                    className="rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-500"
                    data-testid="contact-phone-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Servizio *</label>
                  <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                    <SelectTrigger className="rounded-xl border-slate-200" data-testid="contact-service-select">
                      <SelectValue placeholder="Seleziona servizio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annuncio">Annuncio Immobiliare</SelectItem>
                      <SelectItem value="pratiche">Pratiche Urbanistiche</SelectItem>
                      <SelectItem value="catasto">Aggiornamenti Catastali</SelectItem>
                      <SelectItem value="ape">Certificazione APE</SelectItem>
                      <SelectItem value="visure">Visure e Atti</SelectItem>
                      <SelectItem value="combo">Combo Unica</SelectItem>
                      <SelectItem value="altro">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Messaggio *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descrivi brevemente la tua richiesta..."
                  rows={4}
                  className="rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-500 resize-none"
                  data-testid="contact-message-input"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-full py-6 text-lg font-semibold"
                data-testid="contact-submit-button"
              >
                {isSubmitting ? "Invio in corso..." : "Invia Richiesta"}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Inviando questo form accetti la nostra privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// =====================
// FOOTER
// =====================
const Footer = ({ onShowPrivacy, onShowCookie }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold mb-4">
              spazio<span className="text-sky-400">pratiche</span>
            </div>
            <p className="text-slate-400 max-w-md mb-6">
              Il tuo alleato nella burocrazia. Una soluzione completa e personalizzata a supporto delle agenzie immobiliari.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/spaziopratiche/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/spaziopratiche/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contatti</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@spaziopratiche.it
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                338/4071025 - 334/7077175
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Via Belfiore 9, 20149 Milano
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Spaziopratiche. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <button onClick={onShowPrivacy} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={onShowCookie} className="hover:text-white transition-colors">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// =====================
// PRIVACY POLICY PAGE
// =====================
const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-sky-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)] prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-6">Ultimo aggiornamento: Gennaio 2025</p>
          
          <h3 className="text-xl font-bold text-slate-900">1. Titolare del Trattamento</h3>
          <p>Il Titolare del trattamento dei dati è:</p>
          <p><strong>Arch. Marco Steve Sellitti</strong><br />
          Via Belfiore 9, 20149 Milano<br />
          Email: info@spaziopratiche.it<br />
          Tel: 02/35988262</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">2. Tipologie di Dati Raccolti</h3>
          <p>Fra i Dati Personali raccolti da questo sito, in modo autonomo o tramite terze parti, ci sono:</p>
          <ul>
            <li>Dati di contatto (nome, cognome, email, telefono)</li>
            <li>Dati aziendali (ragione sociale, partita IVA, sede legale, codice univoco)</li>
            <li>Dati di navigazione e cookie tecnici</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-6">3. Finalità del Trattamento</h3>
          <p>I dati dell'Utente sono raccolti per le seguenti finalità:</p>
          <ul>
            <li>Erogazione dei servizi richiesti</li>
            <li>Gestione degli appuntamenti</li>
            <li>Rispondere alle richieste di contatto</li>
            <li>Adempimenti amministrativi e fiscali</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-6">4. Base Giuridica del Trattamento</h3>
          <p>Il trattamento dei dati si basa su:</p>
          <ul>
            <li>Consenso dell'interessato</li>
            <li>Esecuzione di un contratto</li>
            <li>Adempimento di obblighi legali</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-6">5. Modalità di Trattamento</h3>
          <p>Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con modalità organizzative e logiche strettamente correlate alle finalità indicate.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">6. Conservazione dei Dati</h3>
          <p>I dati sono conservati per il tempo strettamente necessario a conseguire gli scopi per cui sono stati raccolti e comunque non oltre i termini previsti dalla legge.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">7. Diritti dell'Interessato</h3>
          <p>Gli Utenti possono esercitare determinati diritti con riferimento ai Dati trattati dal Titolare. In particolare, l'Utente ha il diritto di:</p>
          <ul>
            <li>Accedere ai propri dati</li>
            <li>Richiedere la rettifica o la cancellazione</li>
            <li>Limitare il trattamento</li>
            <li>Opporsi al trattamento</li>
            <li>Richiedere la portabilità dei dati</li>
            <li>Revocare il consenso</li>
            <li>Proporre reclamo all'Autorità Garante</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-6">8. Contatti</h3>
          <p>Per esercitare i propri diritti o per qualsiasi informazione relativa al trattamento dei dati personali, è possibile contattare il Titolare all'indirizzo email: <strong>info@spaziopratiche.it</strong></p>
        </div>
      </div>
    </div>
  );
};

// =====================
// COOKIE POLICY PAGE
// =====================
const CookiePolicy = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-sky-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Cookie Policy</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)] prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-6">Ultimo aggiornamento: Gennaio 2025</p>
          
          <h3 className="text-xl font-bold text-slate-900">1. Cosa sono i Cookie</h3>
          <p>I cookie sono piccoli file di testo che i siti visitati inviano al browser dell'utente, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">2. Titolare del Trattamento</h3>
          <p><strong>Arch. Marco Steve Sellitti</strong><br />
          Via Belfiore 9, 20149 Milano<br />
          Email: info@spaziopratiche.it</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">3. Tipologie di Cookie Utilizzati</h3>
          
          <h4 className="text-lg font-semibold text-slate-800 mt-4">Cookie Tecnici (necessari)</h4>
          <p>Questi cookie sono essenziali per il corretto funzionamento del sito e non possono essere disabilitati. Includono:</p>
          <ul>
            <li>Cookie di sessione per la gestione del login</li>
            <li>Cookie per le preferenze di navigazione</li>
            <li>Cookie per la sicurezza</li>
          </ul>

          <h4 className="text-lg font-semibold text-slate-800 mt-4">Cookie Funzionali</h4>
          <p>Questi cookie permettono al sito di ricordare le scelte dell'utente e fornire funzionalità personalizzate.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">4. Cookie di Terze Parti</h3>
          <p>Il sito non utilizza cookie di profilazione o di tracciamento di terze parti a fini pubblicitari.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">5. Gestione dei Cookie</h3>
          <p>L'utente può gestire le preferenze relative ai cookie attraverso le impostazioni del proprio browser. Ecco i link alle istruzioni dei principali browser:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Microsoft Edge</a></li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-6">6. Conseguenze della Disabilitazione dei Cookie</h3>
          <p>La disabilitazione dei cookie tecnici potrebbe compromettere l'utilizzo di alcune funzionalità del sito, come il sistema di login e la prenotazione degli appuntamenti.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">7. Aggiornamenti</h3>
          <p>La presente Cookie Policy può essere soggetta a modifiche nel tempo. Si consiglia di consultare periodicamente questa pagina.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-6">8. Contatti</h3>
          <p>Per qualsiasi domanda relativa alla presente Cookie Policy, è possibile contattarci all'indirizzo: <strong>info@spaziopratiche.it</strong></p>
        </div>
      </div>
    </div>
  );
};

// =====================
// MAIN APP
// =====================
function App() {
  const { user, token, loading, login, logout, register } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookie, setShowCookie] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <Navigation 
        onOpenBooking={() => setIsBookingOpen(true)} 
        user={user}
        onLogout={logout}
      />
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        user={user}
        token={token}
        onLogin={login}
        onLogout={logout}
        onRegister={register}
      />
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showCookie && <CookiePolicy onClose={() => setShowCookie(false)} />}
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <StatsSection />
      <WhyUsSection />
      <PricingSection />
      <ContactSection />
      <Footer 
        onShowPrivacy={() => setShowPrivacy(true)}
        onShowCookie={() => setShowCookie(true)}
      />
    </div>
  );
}

export default App;
