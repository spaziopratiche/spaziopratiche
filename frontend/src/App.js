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
  ChevronDown,
  Menu,
  X
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Animated Counter Component
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

// Navigation
const Navigation = () => {
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
            <Button 
              onClick={() => scrollToSection("contatti")}
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6"
            >
              Richiedi Preventivo
            </Button>
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
              onClick={() => scrollToSection("contatti")}
              className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full"
            >
              Richiedi Preventivo
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
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
          Una soluzione completa e personalizzata a supporto delle agenzie immobiliari. 
          Dal rilievo al rogito, senza pensieri.
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

// Services Section - Editorial Style (No Cards)
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
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-sky-500 font-semibold text-sm tracking-wider uppercase mb-4 block">I Nostri Servizi</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Tutto ciò di cui hai bisogno per arrivare al rogito senza problemi.
          </h2>
          <p className="text-lg text-slate-600">
            La nostra attività si concentra su una gamma completa di servizi legati alla compravendita e alla locazione di immobili.
          </p>
        </div>

        {/* Services List - Editorial Style */}
        <div className="space-y-0 divide-y divide-slate-200">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center hover:bg-slate-50 transition-colors -mx-6 px-6 lg:-mx-8 lg:px-8 cursor-pointer"
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

// Process Section - Timeline Style
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
          {/* Left Side - Text */}
          <div>
            <span className="text-sky-500 font-semibold text-sm tracking-wider uppercase mb-4 block">Come Funziona</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Dal problema alla soluzione in 5 semplici passi.
            </h2>
            <p className="text-lg text-slate-600">
              Durante tutto il processo sarà nostra cura mantenere con il proprietario la massima riservatezza in relazione agli accordi economici e di incarico presi con l'agenzia di riferimento.
            </p>
          </div>

          {/* Right Side - Steps */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500 via-sky-300 to-transparent" />
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-6 group" data-testid={`process-step-${index}`}>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center font-bold text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-lg">
                    {step.number}
                  </div>
                  <div className="flex-1 pb-8">
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

// Stats Section
const StatsSection = () => {
  const stats = [
    { value: 1250, suffix: "+", label: "Pratiche Edilizie" },
    { value: 3220, suffix: "+", label: "Certificazioni Energetiche" },
    { value: 28, suffix: "+", label: "Partnership Attive" },
    { value: 10, suffix: "+", label: "Anni nel Settore" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 to-sky-900 relative overflow-hidden">
      {/* Background Pattern */}
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

// Why Choose Us Section
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
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

// Pricing Section
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

          {/* Featured Package */}
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

// Contact Section
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
          {/* Left - Info */}
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
                  <p className="font-semibold text-slate-900">02/35988262</p>
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

          {/* Right - Form */}
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
                      <SelectItem value="combo">Esempio di Combo Unica</SelectItem>
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

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold mb-4">
              spazio<span className="text-sky-400">pratiche</span>
            </div>
            <p className="text-slate-400 max-w-md mb-6">
              Il tuo alleato nella burocrazia. Una soluzione completa e personalizzata a supporto delle agenzie immobiliari.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
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
                02/35988262
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
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Termini di Servizio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <StatsSection />
      <WhyUsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
