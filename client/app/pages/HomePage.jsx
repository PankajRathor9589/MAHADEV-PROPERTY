import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CarFront,
  CheckCircle2,
  Clock3,
  Crown,
  Droplets,
  Home,
  Landmark,
  Layers3,
  LockKeyhole,
  MapPin,
  MessageCircleMore,
  Mic,
  Phone,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";
import {
  BUYER_JOURNEY,
  COMPANY_INFO,
  CONTACT_SERVICE_OPTIONS,
  CONTRACTOR_PROJECTS,
  HERO_STATS,
  MARKET_HIGHLIGHTS,
  SEARCH_BUDGET_OPTIONS,
  SERVICE_PILLARS,
  TESTIMONIAL_STYLE_NOTES,
  TRUST_DESCRIPTIONS
} from "../data/siteContent.js";
import { API_BASE_URL, fetchProperties } from "../services/api.js";
import { formatCurrency, toWhatsAppHref } from "../utils/format.js";

const serviceIcons = {
  map: Landmark,
  home: Home,
  building: Building2,
  investment: TrendingUp
};

const smartLocalities = [
  "Makronia",
  "Civil Line",
  "Tili Road",
  "Sagar Cantt",
  "Moti Nagar",
  "Station Road",
  "Bamora",
  "Khurai Road"
];

const aiSearchSuggestions = [
  "3BHK villa near Civil Line under 1.5 Cr",
  "Commercial property on Tili Road for rental yield",
  "Plot in Makronia with future appreciation",
  "Family home in Sagar with low-traffic locality"
];

const futureExperienceCards = [
  {
    title: "AI Match Score",
    description: "Budget, lifestyle, commute, and confidence signals combine into a fast shortlist score.",
    icon: Sparkles,
    badge: "95% Match"
  },
  {
    title: "Virtual Renovation",
    description: "Before and after previews help buyers imagine upgrades before scheduling a visit.",
    icon: Layers3,
    badge: "AR Ready"
  },
  {
    title: "Live Video Walkthrough",
    description: "Remote property tours with owner-guided narration for urgent or long-distance buyers.",
    icon: Video,
    badge: "Live Tour"
  },
  {
    title: "Property Comparison",
    description: "Compare up to three properties side by side without losing your shortlist context.",
    icon: BarChart3,
    badge: "3-Way"
  },
  {
    title: "Neighborhood Insights",
    description: "Noise, water supply, traffic, and local review signals make each locality easier to evaluate.",
    icon: MapPin,
    badge: "Verified"
  },
  {
    title: "Shared Family Shortlist",
    description: "Private comments, voting, and collaborative decisions for families choosing together.",
    icon: Users,
    badge: "Collaborative"
  },
  {
    title: "Anti-Spam Privacy",
    description: "Buyer numbers stay hidden until there is real intent to call, visit, or negotiate.",
    icon: LockKeyhole,
    badge: "Protected"
  },
  {
    title: "Premium Buyer Pass",
    description: "Early access drops, better builder previews, and invitation-first premium inventory.",
    icon: Crown,
    badge: "Invite Only"
  }
];

const investorCounters = [
  { value: "120+", label: "Verified investment opportunities surfaced with premium detail." },
  { value: "24h", label: "Average response rhythm across premium enquiries and WhatsApp concierge." },
  { value: "95%", label: "AI-ready shortlist confidence for qualified buyer intent." },
  { value: "3x", label: "Faster decision support with comparison, insights, and privacy cues." }
];

const trustedDeveloperModes = [
  {
    title: "Independent Builders",
    description: "Premium villa, duplex, and family-home inventory presented with sharper positioning."
  },
  {
    title: "Township Developers",
    description: "Land parcels and plotted communities packaged for investor clarity and future growth."
  },
  {
    title: "Commercial Promoters",
    description: "Frontage, access, and yield-oriented commercial assets framed for business buyers."
  }
];

const marketGrowthBars = [
  { label: "2021", value: 34, note: "Early plotted demand" },
  { label: "2022", value: 46, note: "Infrastructure lift" },
  { label: "2023", value: 63, note: "Buyer confidence" },
  { label: "2024", value: 78, note: "Investor traction" },
  { label: "2025", value: 92, note: "Premium positioning" }
];

const smartCitySignals = [
  { title: "Infrastructure Momentum", value: "18%", detail: "Higher buyer confidence around growth corridors." },
  { title: "Rental Yield Watch", value: "7.4%", detail: "Commercial and hybrid-family assets gaining interest." },
  { title: "Land Appreciation", value: "22%", detail: "Select plotted pockets showing stronger long-term intent." }
];

const neighborhoodInsights = [
  { title: "Noise Level", value: "Low", detail: "Quieter family pockets near planned residential clusters.", icon: Clock3 },
  { title: "Water Supply", value: "Stable", detail: "Priority zones shortlisted for daily-use practicality.", icon: Droplets },
  { title: "Traffic Flow", value: "Balanced", detail: "Faster site visits and better daily commute potential.", icon: CarFront },
  { title: "Local Reviews", value: "Verified", detail: "Hyperlocal trust signals packaged for serious buyers.", icon: Star }
];

const expertVideoSnippets = [
  {
    title: "Hyperlocal Price Brief",
    duration: "04:12",
    description: "A short market note on where premium plotted demand is forming inside Sagar."
  },
  {
    title: "Family Buyer Site Visit Guide",
    duration: "06:08",
    description: "How to evaluate access, water, locality feel, and future livability in one walk-through."
  },
  {
    title: "Commercial Asset Quick Scan",
    duration: "05:34",
    description: "A builder-grade checklist for frontage, traffic, and tenant-ready visibility."
  }
];

const buyerPassNotes = [
  "Private family voting and comments for shared decisions.",
  "Anti-spam masking until a real call or site visit is approved.",
  "Early access premium buyer pass for faster shortlist visibility."
];

const intelligenceLayerCards = [
  {
    title: "Predictive Pricing",
    description: "AI-assisted price outlook cards can show likely 2 to 3 year appreciation trends for plots, homes, and commercial pockets.",
    badge: "2-3 Year Outlook",
    icon: TrendingUp
  },
  {
    title: "Lifestyle Matching",
    description: "Shortlist properties by calm streets, family comfort, commute time, school access, and investment fit instead of only price filters.",
    badge: "Smart Match",
    icon: Bot
  },
  {
    title: "Voice Search for India",
    description: "Mixed Hindi-English queries like 'Makronia me plot dikhaiye' or '2 BHK near Civil Line' feel natural on mobile-first browsing.",
    badge: "Voice Ready",
    icon: Mic
  },
  {
    title: "Virtual Assistant",
    description: "A digital receptionist layer can answer school, road, builder, and site-visit questions instantly before a call even starts.",
    badge: "Concierge",
    icon: MessageCircleMore
  }
];

const trustStudioCards = [
  {
    title: "Verified Review Community",
    description: "Resident-led reviews, locality satisfaction notes, and buyer visit feedback create stronger trust than polished marketing copy alone.",
    badge: "Resident Signals",
    icon: Users
  },
  {
    title: "Luminosity Reports",
    description: "Sunlight, ventilation, airflow, and everyday comfort can be surfaced as simple home-readiness scores on premium listings.",
    badge: "Light + Air",
    icon: Sparkles
  },
  {
    title: "Legal Trust Checker",
    description: "RERA, document readiness, land-history notes, and dispute-risk summaries help local families feel safer before token discussions.",
    badge: "Trust Score",
    icon: ShieldCheck
  }
];

const revenueEngineCards = [
  {
    title: "Property Management SaaS",
    description: "Landlords can track rent collection, maintenance requests, and tenant paperwork from one controlled owner dashboard.",
    icon: Building2
  },
  {
    title: "Partner Services",
    description: "Home loans, insurance, painting, interiors, and movers create commission-ready service revenue around every lead.",
    icon: Home
  },
  {
    title: "Professional Showcase",
    description: "Drone shoots, premium photography, and 3D tours can be sold as an upgrade to brokers, builders, and serious sellers.",
    icon: Video
  }
];

const localSeoZones = [
  { label: "Plots in Makronia", href: "/properties?location=Makronia&type=Plot" },
  { label: "Family homes in Civil Line", href: "/properties?location=Civil%20Line&type=House" },
  { label: "Commercial property in Tili Road", href: "/properties?location=Tili%20Road&type=Commercial" },
  { label: "Investment property in Sagar Cantt", href: "/properties?location=Sagar%20Cantt" },
  { label: "Plots near Khurai Road", href: "/properties?location=Khurai%20Road&type=Plot" },
  { label: "Shops in Station Road", href: "/properties?location=Station%20Road&type=Commercial" }
];

const faqItems = [
  {
    question: "Do you deal in plots, homes, and commercial property in Sagar MP?",
    answer: "Yes. Sagar Infra focuses on plots, family homes, shops, office-ready assets, and local investment opportunities across Sagar and nearby areas."
  },
  {
    question: "Can I book a site visit on WhatsApp?",
    answer: "Yes. Buyers can use WhatsApp or call directly to book a site visit, request live availability, or get quick price guidance."
  },
  {
    question: "Do you help middle-class families choose local areas?",
    answer: "Yes. The website and consultation flow are designed to help families compare location comfort, road access, school reach, and future value."
  },
  {
    question: "How do you build trust before the visit?",
    answer: "We use verified listing cues, local-area context, protected lead handling, and fast direct contact with Prashant Rathor."
  },
  {
    question: "Which areas do you cover in and around Sagar?",
    answer: "We cover Sagar city and nearby localities including Makronia, Civil Line, Tili Road, Station Road, Khurai Road, and other growth zones based on live inventory."
  }
];

const popupBenefits = [
  "Get live price guidance before you travel.",
  "Book a site visit without waiting for a long callback chain.",
  "Talk directly to a local property expert in Sagar MP."
];

const comparisonCriteria = [
  { label: "AI Match", getValue: (property) => `${getMatchScore(property)}%` },
  { label: "Price", getValue: (property) => formatCurrency(property.price) },
  { label: "Layout", getValue: (property) => (property.bedrooms > 0 ? `${property.bedrooms} BHK` : property.category) },
  { label: "Area", getValue: (property) => (property.area ? `${property.area} sq.ft` : "On request") },
  { label: "Listing Mode", getValue: (property) => (property.listingType === "rent" ? "Rent" : "Buy") },
  { label: "Trust", getValue: (property) => (property.approvalStatus === "approved" ? "Verified" : "Fresh") }
];

const budgetRangeToParams = (value) => {
  if (!value) {
    return {};
  }

  const [minPrice, maxPrice] = String(value).split("-");
  return {
    ...(minPrice ? { minPrice } : {}),
    ...(maxPrice ? { maxPrice } : {})
  };
};

const parseAmountValue = (value = "") => {
  const match = String(value)
    .trim()
    .match(/(\d+(?:\.\d+)?)\s*(cr|crore|lac|lakh)?/i);

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);
  const unit = String(match[2] || "").toLowerCase();

  if (!Number.isFinite(amount)) {
    return null;
  }

  if (unit === "cr" || unit === "crore") {
    return Math.round(amount * 10000000);
  }

  if (unit === "lac" || unit === "lakh") {
    return Math.round(amount * 100000);
  }

  return Math.round(amount);
};

const parseNaturalBudget = (query = "") => {
  const normalizedQuery = String(query).toLowerCase();
  const betweenMatch = normalizedQuery.match(
    /between\s+([\d.\s]+(?:cr|crore|lac|lakh)?)\s+and\s+([\d.\s]+(?:cr|crore|lac|lakh)?)/i
  );

  if (betweenMatch) {
    const minPrice = parseAmountValue(betweenMatch[1]);
    const maxPrice = parseAmountValue(betweenMatch[2]);

    return {
      ...(minPrice ? { minPrice } : {}),
      ...(maxPrice ? { maxPrice } : {})
    };
  }

  const maxMatch = normalizedQuery.match(/(?:under|below|up to)\s+([\d.\s]+(?:cr|crore|lac|lakh)?)/i);
  if (maxMatch) {
    const maxPrice = parseAmountValue(maxMatch[1]);
    return maxPrice ? { maxPrice } : {};
  }

  const minMatch = normalizedQuery.match(/(?:above|over|from)\s+([\d.\s]+(?:cr|crore|lac|lakh)?)/i);
  if (minMatch) {
    const minPrice = parseAmountValue(minMatch[1]);
    return minPrice ? { minPrice } : {};
  }

  return {};
};

const inferPropertyType = (query = "") => {
  const normalizedQuery = String(query).toLowerCase();

  if (/villa/.test(normalizedQuery)) {
    return "Villa";
  }

  if (/flat|apartment/.test(normalizedQuery)) {
    return "Apartment";
  }

  if (/plot|land/.test(normalizedQuery)) {
    return "Plot";
  }

  if (/commercial|office|shop/.test(normalizedQuery)) {
    return "Commercial";
  }

  if (/house|home|duplex/.test(normalizedQuery)) {
    return "House";
  }

  return "";
};

const inferBedrooms = (query = "") => {
  const match = String(query).toLowerCase().match(/(\d+)\s*bhk/);
  return match?.[1] || "";
};

const extractLocationFromQuery = (query = "") => {
  const match = String(query)
    .trim()
    .match(/\bin\s+([a-zA-Z\s]+?)(?=\s+(?:under|below|up to|near|with|for|between)\b|$)/i);

  return match?.[1]?.trim() || "";
};

const getMatchScore = (property) => {
  const priceSignal = property.price ? Math.max(0, 10 - Math.min(8, Math.floor(property.price / 25000000))) : 5;
  const featureSignal = property.isFeatured ? 9 : 4;
  const sizeSignal = property.area ? Math.min(7, Math.max(2, Math.floor(property.area / 450))) : 3;
  const trustSignal = property.approvalStatus === "approved" ? 8 : 3;
  const activitySignal = property.views ? Math.min(6, Math.floor(property.views / 15)) : 4;

  return Math.min(98, 68 + priceSignal + featureSignal + sizeSignal + trustSignal + activitySignal);
};

const calculateEmi = ({ propertyValue, downPayment, annualRate, tenureYears }) => {
  const principal = Math.max(0, Number(propertyValue || 0) - Number(downPayment || 0));
  const monthlyRate = Number(annualRate || 0) / 1200;
  const totalMonths = Math.max(1, Number(tenureYears || 1) * 12);

  if (!principal) {
    return {
      principal: 0,
      monthlyEmi: 0,
      totalPayment: 0,
      totalInterest: 0
    };
  }

  const monthlyEmi =
    monthlyRate === 0
      ? principal / totalMonths
      : (principal * monthlyRate * (1 + monthlyRate) ** totalMonths) / ((1 + monthlyRate) ** totalMonths - 1);
  const totalPayment = monthlyEmi * totalMonths;

  return {
    principal,
    monthlyEmi,
    totalPayment,
    totalInterest: totalPayment - principal
  };
};

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(Boolean(API_BASE_URL));
  const [propertyMode, setPropertyMode] = useState(API_BASE_URL ? "featured" : "unavailable");
  const [propertyMessage, setPropertyMessage] = useState(
    API_BASE_URL ? "" : "Live property inventory is unavailable until the API is configured for this deployment."
  );
  const [compareList, setCompareList] = useState([]);
  const [compareMessage, setCompareMessage] = useState("");
  const [voiceStatus, setVoiceStatus] = useState(
    "Voice search beta is ready for supported browsers. Try Hindi or English requests for plots, homes, or commercial property."
  );
  const [listening, setListening] = useState(false);
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const [searchForm, setSearchForm] = useState({
    query: "",
    location: "",
    type: "",
    budget: ""
  });
  const [emiForm, setEmiForm] = useState({
    propertyValue: "8500000",
    downPayment: "1500000",
    annualRate: "8.35",
    tenureYears: "20"
  });

  useEffect(() => {
    const loadProperties = async () => {
      if (!API_BASE_URL) {
        setLoadingProperties(false);
        return;
      }

      try {
        setLoadingProperties(true);
        setPropertyMessage("");
        const featuredResponse = await fetchProperties({
          featured: true,
          limit: 6,
          sort: "latest"
        });
        let nextProperties = featuredResponse.data || [];

        if (!nextProperties.length) {
          const latestResponse = await fetchProperties({
            limit: 6,
            sort: "latest"
          });
          nextProperties = latestResponse.data || [];
          setPropertyMode("latest");
        } else {
          setPropertyMode("featured");
        }

        setFeaturedProperties(nextProperties);

        if (!nextProperties.length) {
          setPropertyMessage("No live properties have been published yet. Add the first listing from the admin dashboard.");
        }
      } catch (error) {
        setFeaturedProperties([]);
        setPropertyMode("unavailable");
        setPropertyMessage(error.message || "Live inventory is temporarily unavailable.");
      } finally {
        setLoadingProperties(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    try {
      if (window.sessionStorage.getItem("sagar-infra-lead-prompt-dismissed") === "1") {
        return undefined;
      }
    } catch {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowLeadPrompt(true);
    }, 14000);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredLocationSuggestions = useMemo(() => {
    if (!searchForm.location.trim()) {
      return smartLocalities.slice(0, 4);
    }

    return smartLocalities
      .filter((item) => item.toLowerCase().includes(searchForm.location.trim().toLowerCase()))
      .slice(0, 5);
  }, [searchForm.location]);

  const emiSummary = useMemo(() => calculateEmi(emiForm), [emiForm]);
  const homeStructuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          name: COMPANY_INFO.name,
          telephone: `+${COMPANY_INFO.phoneIntl}`,
          url: COMPANY_INFO.canonicalUrl,
          areaServed: [COMPANY_INFO.city, COMPANY_INFO.state],
          address: {
            "@type": "PostalAddress",
            addressLocality: COMPANY_INFO.city,
            addressRegion: COMPANY_INFO.state,
            addressCountry: "IN"
          }
        },
        {
          "@type": "RealEstateAgent",
          name: COMPANY_INFO.name,
          url: COMPANY_INFO.canonicalUrl,
          areaServed: [COMPANY_INFO.city, COMPANY_INFO.state],
          telephone: `+${COMPANY_INFO.phoneIntl}`
        },
        {
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }
      ]
    }),
    []
  );

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchForm((current) => ({ ...current, [name]: value }));
  };

  const handleEmiChange = (event) => {
    const { name, value } = event.target;
    setEmiForm((current) => ({ ...current, [name]: value }));
  };

  const handleQuickSuggestion = (value) => {
    setSearchForm((current) => ({ ...current, query: value }));
  };

  const handleLocationSelection = (value) => {
    setSearchForm((current) => ({ ...current, location: value }));
  };

  const handleTypeSelection = (value) => {
    setSearchForm((current) => ({ ...current, type: current.type === value ? "" : value }));
  };

  const handleBudgetSelection = (value) => {
    setSearchForm((current) => ({ ...current, budget: current.budget === value ? "" : value }));
  };

  const dismissLeadPrompt = () => {
    setShowLeadPrompt(false);

    if (typeof window === "undefined") {
      return;
    }

    try {
      window.sessionStorage.setItem("sagar-infra-lead-prompt-dismissed", "1");
    } catch {
      return;
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const inferredLocation = searchForm.location.trim() || extractLocationFromQuery(searchForm.query);
    const inferredType = searchForm.type || inferPropertyType(searchForm.query);
    const inferredBedrooms = inferBedrooms(searchForm.query);
    const searchBudget = searchForm.budget ? budgetRangeToParams(searchForm.budget) : parseNaturalBudget(searchForm.query);
    const nextParams = new URLSearchParams({
      sort: "latest"
    });

    if (searchForm.query.trim()) {
      nextParams.set("search", searchForm.query.trim());
    }

    if (inferredLocation) {
      nextParams.set("location", inferredLocation);
    }

    if (inferredType) {
      nextParams.set("type", inferredType);
    }

    if (inferredBedrooms) {
      nextParams.set("bedrooms", inferredBedrooms);
    }

    Object.entries(searchBudget).forEach(([key, value]) => nextParams.set(key, String(value)));

    navigate(`/properties?${nextParams.toString()}`);
  };

  const startVoiceSearch = () => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setVoiceStatus(
        "Voice search is not available on this browser yet. You can still use the natural language search field."
      );
      return;
    }

    const recognition = new SpeechRecognitionApi();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    setVoiceStatus("Listening for your Hindi or English property request...");

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";

      if (transcript) {
        setSearchForm((current) => ({ ...current, query: transcript }));
        setVoiceStatus(`Captured: "${transcript}"`);
      }
    };

    recognition.onerror = () => {
      setVoiceStatus("Voice search could not capture your request. Try again or type into the AI search field.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const handleCompareToggle = (property) => {
    setCompareMessage("");
    setCompareList((current) => {
      const alreadySelected = current.some((item) => item._id === property._id);

      if (alreadySelected) {
        return current.filter((item) => item._id !== property._id);
      }

      if (current.length >= 3) {
        setCompareMessage("Compare up to 3 properties at a time. Remove one item to add a new listing.");
        return current;
      }

      return [...current, property];
    });
  };

  const searchSummaryLabel = useMemo(() => {
    const filters = [
      searchForm.query ? "NLP search ready" : "",
      searchForm.location ? `${searchForm.location} locality` : "",
      searchForm.type ? searchForm.type : "",
      searchForm.budget ? "Budget filtered" : ""
    ].filter(Boolean);

    return filters.length ? filters.join(" | ") : "Use voice, AI suggestions, or budget chips to build a fast shortlist.";
  }, [searchForm.budget, searchForm.location, searchForm.query, searchForm.type]);

  return (
    <>
      <Seo
        title={COMPANY_INFO.metaTitle}
        description={COMPANY_INFO.metaDescription}
        canonical={COMPANY_INFO.canonicalUrl}
        image={`${COMPANY_INFO.canonicalUrl}/og-image.svg`}
        keywords={COMPANY_INFO.metaKeywords}
        structuredData={homeStructuredData}
      />

      <section className="relative isolate -mt-[5.8rem] min-h-[100svh] overflow-hidden pt-[5.8rem]">
        <div className="absolute inset-0">
          <div className="hero-media-pan absolute inset-0">
            <ResponsiveImage
              src={COMPANY_INFO.heroImage}
              alt="Luxury property investment backdrop for Sagar Infra"
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sizes="100vw"
              widths={[640, 960, 1280, 1600, 1920]}
              transformOptions={{ quality: 84 }}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(4,9,18,0.94)_10%,rgba(4,9,18,0.6)_42%,rgba(7,17,29,0.34)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(212,175,55,0.2),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(103,136,192,0.18),transparent_22%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:78px_78px] [mask-image:linear-gradient(180deg,black,rgba(0,0,0,0.18))]" />
          <div className="floating-glow absolute -left-10 top-20 h-56 w-56 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="floating-glow absolute bottom-16 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-5.8rem)] w-full max-w-[1480px] items-end px-4 pb-[clamp(4.75rem,9vw,8rem)] pt-[clamp(7rem,12vw,10.5rem)] sm:px-6 lg:px-8">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] lg:items-end">
            <Reveal className="max-w-[min(58rem,100%)]" delay={0.04} y={18}>
              <span className="luxury-kicker inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 font-semibold text-white/82 backdrop-blur-xl">
                <Sparkles size={14} className="text-gold-300" />
                Verified Local Property Intelligence
              </span>
              <h1 className="hero-display mt-6 max-w-5xl text-white">{COMPANY_INFO.heroHeadline}</h1>
              <p className="hero-subtitle mt-6 max-w-3xl text-white/82">{COMPANY_INFO.heroSubheadline}</p>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-white/68 sm:text-base">
                {COMPANY_INFO.serviceLine}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/properties" className="btn-primary w-full sm:w-auto">
                  Explore Properties
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#consultation"
                  className="btn-secondary w-full border-white/16 bg-white/[0.08] text-white hover:border-white/28 hover:bg-white/14 hover:text-white sm:w-auto"
                >
                  Book Site Visit
                </a>
                <a
                  href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp w-full sm:w-auto"
                >
                  <MessageCircleMore size={16} />
                  WhatsApp Concierge
                </a>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                Call or WhatsApp Prashant Rathor now for live prices, local guidance, and same-day site-visit coordination across Sagar MP.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {HERO_STATS.map((item, index) => (
                  <Reveal key={item.label} delay={0.08 + index * 0.04} y={20}>
                    <div className="rounded-[26px] border border-white/14 bg-white/[0.08] p-4 text-white shadow-[0_18px_40px_rgba(4,10,18,0.16)] backdrop-blur-[18px]">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-200">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-white/78">{item.label}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {TRUST_DESCRIPTIONS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/82 backdrop-blur-xl"
                  >
                    <ShieldCheck size={14} className="text-gold-200" />
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal className="hidden lg:block lg:justify-self-end" delay={0.14} y={28}>
              <div className="flex max-w-[25rem] flex-col gap-4">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-[30px] border border-white/14 bg-white/[0.08] p-5 text-white shadow-[0_22px_52px_rgba(4,10,18,0.18)] backdrop-blur-[22px]"
                >
                  <p className="section-kicker text-gold-200">Investor Console</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-[0.96] text-white">
                    Premium search, privacy, and shortlist cues
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/74">
                    Search with natural language, filter like a pro, and build a family-ready shortlist without losing speed.
                  </p>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-[28px] border border-white/14 bg-[#08111d]/58 p-5 text-white shadow-[0_18px_46px_rgba(4,10,18,0.18)] backdrop-blur-xl"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-200">Buyer Pass</p>
                    <p className="mt-3 text-2xl font-semibold">Invite-first premium inventory</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-[28px] border border-white/14 bg-white/[0.08] p-5 text-white shadow-[0_18px_46px_rgba(4,10,18,0.16)] backdrop-blur-xl"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-200">Privacy Layer</p>
                    <p className="mt-3 text-2xl font-semibold">Serious intent before number reveal</p>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-[clamp(4.5rem,8vw,6.25rem)]">
        <div className="section-shell pt-0">
          <div className="search-floating-shell">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="section-kicker">Floating AI Search</p>
                    <h2 className="section-title-luxury mt-3 text-ink-900">
                      Search like you talk. Filter like an investor.
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#ddd1be] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-700">
                    <Bot size={14} className="text-gold-600" />
                    AI suggestions
                  </span>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSearchSubmit}>
                  <div className="rounded-[30px] border border-[#ece1d0] bg-white p-3 shadow-[0_18px_42px_rgba(8,16,28,0.06)]">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-400" size={20} />
                        <input
                          className="w-full rounded-[24px] border-0 bg-[#f7f3ec] py-5 pl-14 pr-4 text-base text-ink-900 outline-none ring-0 placeholder:text-ink-400 focus:bg-white"
                          name="query"
                          value={searchForm.query}
                          onChange={handleSearchChange}
                          placeholder='Try "2 BHK in Civil Line under 50 lakh" or "Makronia me plot dikhaiye"'
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={startVoiceSearch}
                          className={`btn-ghost w-full sm:w-auto ${listening ? "border-gold-300 bg-[#f7ecd7] text-ink-900" : ""}`}
                        >
                          <Mic size={16} />
                          {listening ? "Listening..." : "Voice Search"}
                        </button>
                        <button className="btn-primary w-full sm:w-auto">
                          Search Properties
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
                    <div className="rounded-[28px] border border-[#ece1d0] bg-[#fbf8f2] p-5">
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                            Location Autocomplete
                          </label>
                          <input
                            className="input-field"
                            name="location"
                            value={searchForm.location}
                            onChange={handleSearchChange}
                            placeholder="Sagar, Makronia, Civil Line"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                            Search Memory
                          </label>
                          <div className="rounded-[22px] border border-[#e9dece] bg-white px-4 py-3 text-sm text-ink-600">
                            {searchSummaryLabel}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {filteredLocationSuggestions.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleLocationSelection(item)}
                            className={`search-chip ${searchForm.location === item ? "search-chip-active" : ""}`}
                          >
                            <MapPin size={14} className="text-gold-600" />
                            {item}
                          </button>
                        ))}
                      </div>

                      <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                          AI smart suggestions
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {aiSearchSuggestions.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleQuickSuggestion(item)}
                              className="search-chip"
                            >
                              <Sparkles size={14} className="text-gold-600" />
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-[#ece1d0] bg-[#fbf8f2] p-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                          Property Type Filters
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Plot", "Apartment", "Villa", "House", "Commercial"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleTypeSelection(item)}
                              className={`search-chip ${searchForm.type === item ? "search-chip-active" : ""}`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">Budget Chips</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {SEARCH_BUDGET_OPTIONS.filter((option) => option.value).map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleBudgetSelection(option.value)}
                              className={`search-chip ${searchForm.budget === option.value ? "search-chip-active" : ""}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="rounded-[34px] border border-white/8 bg-[#08111d] p-6 text-white shadow-[0_26px_80px_rgba(6,12,20,0.24)]">
                <p className="section-kicker text-gold-200">AI Copilot</p>
                <h3 className="mt-3 text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.94] text-white">
                  Search cockpit built for premium buyers
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70">{voiceStatus}</p>

                <div className="mt-6 space-y-3">
                  {[
                    "Natural language input understands budget and property type cues.",
                    "Voice search beta can capture live buyer intent on supported browsers.",
                    "Privacy layer keeps the enquiry flow cleaner and more investor-grade."
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/78"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200">Concierge</p>
                    <p className="mt-3 text-lg font-semibold text-white">Book site visits faster</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200">Smart Match</p>
                    <p className="mt-3 text-lg font-semibold text-white">95% fit style UX ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {investorCounters.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.05} className="h-full">
              <div className="glass-panel h-full p-6">
                <p className="text-[clamp(2.3rem,3.5vw,3.6rem)] font-semibold leading-none text-ink-900">
                  {item.value}
                </p>
                <p className="mt-4 text-sm leading-7 text-ink-500">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="services" className="section-shell pt-8">
        <SectionHeading
          kicker="Futuristic Buyer Layer"
          title="A premium decision system built around AI search, privacy, and serious buyer confidence"
          copy="The product experience now stretches beyond brochure visuals into smarter search, comparison, privacy, and faster decision support."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {futureExperienceCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={index * 0.05} className="h-full">
                <div className="glass-panel h-full p-6 transition duration-500 hover:-translate-y-2 hover:border-gold-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
                      <Icon size={24} />
                    </span>
                    <span className="rounded-full border border-[#e5d8c5] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-600">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-3xl font-semibold leading-[0.96] text-ink-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-ink-500">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="properties" className="section-shell pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker={
              propertyMode === "featured"
                ? "Featured Inventory"
                : propertyMode === "latest"
                  ? "Latest Inventory"
                  : "Live Inventory"
            }
            title="Premium property cards that feel closer to product tiles than standard listings"
            copy="Sharper imagery, AI match score cues, protected contact flow, and instant comparison tools turn browsing into a faster premium shortlist."
          />
          <Link to="/properties" className="btn-ghost w-full sm:w-auto">
            Explore All Listings
            <ArrowRight size={16} />
          </Link>
        </div>

        {propertyMessage ? (
          <p className="mt-6 rounded-full border border-gold-300/50 bg-[#f8efdc] px-4 py-3 text-sm text-gold-800">
            {propertyMessage}
          </p>
        ) : null}

        {loadingProperties ? (
          <FeaturedPropertySkeletons />
        ) : featuredProperties.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property, index) => (
              <Reveal key={property._id || property.slug || property.title} delay={index * 0.05}>
                <PropertyCard
                  property={property}
                  onCompare={handleCompareToggle}
                  compareActive={compareList.some((item) => item._id === property._id)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[30px] border border-[#e9dfd2] bg-white p-6 text-sm leading-7 text-ink-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            Property cards will appear here as soon as listings are published from the admin dashboard.
          </div>
        )}

        {compareMessage ? <p className="mt-5 text-sm text-ink-500">{compareMessage}</p> : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <Reveal className="glass-panel p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Property Comparison</p>
                <h3 className="mt-2 text-4xl font-semibold leading-[0.96] text-ink-900">
                  Compare up to 3 properties side by side
                </h3>
              </div>
              <span className="rounded-full border border-[#e5d8c5] bg-[#fbf8f2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
                {compareList.length}/3 selected
              </span>
            </div>

            {compareList.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="px-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                        Criteria
                      </th>
                      {compareList.map((property) => (
                        <th
                          key={property._id}
                          className="rounded-[22px] border border-[#ece1d0] bg-[#fbf8f2] px-4 py-4 text-left text-sm font-semibold text-ink-900"
                        >
                          {property.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonCriteria.map((row) => (
                      <tr key={row.label}>
                        <td className="px-4 py-3 text-sm font-medium text-ink-500">{row.label}</td>
                        {compareList.map((property) => (
                          <td
                            key={`${property._id}-${row.label}`}
                            className="rounded-[22px] border border-[#ece1d0] bg-white px-4 py-3 text-sm text-ink-700"
                          >
                            {row.getValue(property)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-dashed border-[#dccfb9] bg-[#fbf8f2] px-5 py-8 text-sm leading-7 text-ink-500">
                Tap “Compare” on any premium property card to open a side-by-side investor view here.
              </div>
            )}
          </Reveal>

          <Reveal className="glass-panel p-6 sm:p-7" delay={0.08}>
            <p className="section-kicker">Buyer Pass</p>
            <h3 className="mt-2 text-4xl font-semibold leading-[0.96] text-ink-900">
              Family-ready shortlist with privacy-first controls
            </h3>
            <div className="mt-6 space-y-3">
              {buyerPassNotes.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-[#ece1d0] bg-[#fbf8f2] px-4 py-4 text-sm leading-7 text-ink-600"
                >
                  {item}
                </div>
              ))}
            </div>
            <a
              href={toWhatsAppHref(
                COMPANY_INFO.whatsappNumber,
                "Hi SAGAR INFRA, I want premium buyer pass access and a curated shortlist."
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp mt-6 w-full"
            >
              <MessageCircleMore size={16} />
              Request Buyer Pass
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
          <Reveal className="overflow-hidden rounded-[36px] bg-[#08111d] p-7 text-white shadow-[0_28px_90px_rgba(8,16,28,0.2)] sm:p-8">
            <p className="section-kicker text-gold-200">Market Intelligence</p>
            <h2 className="section-title-luxury mt-3 text-white">
              Smart city growth signals presented in a cleaner investor-grade frame
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-white/72 sm:text-base">
              Hyperlocal momentum, premium demand cues, and cleaner data framing make the site feel more like a real estate product than a brochure.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                {MARKET_HIGHLIGHTS.map((item) => (
                  <div key={item.title} className="rounded-[26px] border border-white/10 bg-white/[0.05] p-5">
                    <p className="section-kicker text-gold-200">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200">Growth Chart</p>
                    <p className="mt-2 text-2xl font-semibold text-white">Premium demand curve</p>
                  </div>
                  <TrendingUp size={24} className="text-gold-300" />
                </div>

                <div className="mt-8 flex items-end gap-3">
                  {marketGrowthBars.map((item) => (
                    <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-56 w-full items-end rounded-[20px] bg-white/[0.05] p-2">
                        <div
                          className="w-full rounded-[16px] bg-gradient-to-t from-[#d4af37] via-[#efcf73] to-[#fff3ca] shadow-[0_18px_34px_rgba(212,175,55,0.24)]"
                          style={{ height: `${item.value}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/52">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6">
            <Reveal className="glass-panel p-6 sm:p-7">
              <p className="section-kicker">Smart City Growth</p>
              <h3 className="mt-2 text-4xl font-semibold leading-[0.96] text-ink-900">Signals serious buyers actually use</h3>
              <div className="mt-6 space-y-3">
                {smartCitySignals.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-[#ece1d0] bg-[#fbf8f2] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                      <span className="rounded-full border border-gold-300 bg-[#f7ecd7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                        {item.value}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-ink-500">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="glass-panel p-6 sm:p-7" delay={0.08}>
              <p className="section-kicker">Trusted Developer Showcase</p>
              <h3 className="mt-2 text-4xl font-semibold leading-[0.96] text-ink-900">Presentation modes for stronger builder trust</h3>
              <div className="mt-6 space-y-3">
                {trustedDeveloperModes.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-[#ece1d0] bg-[#fbf8f2] p-4">
                    <p className="text-lg font-semibold text-ink-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-ink-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-shell pt-8">
        <SectionHeading
          kicker="Builder Showcase"
          title="Visual storytelling for developers, plotted launches, and premium commercial assets"
          copy="Builder-grade presentation helps each project feel market-ready even before the first site visit or brochure share."
        />

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {CONTRACTOR_PROJECTS.map((project, index) => (
            <Reveal
              key={project.title}
              className="overflow-hidden rounded-[36px] border border-[#e6dccd] bg-white shadow-[0_22px_55px_rgba(15,23,42,0.08)]"
              delay={index * 0.08}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ResponsiveImage
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  sizes="(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 100vw"
                  widths={[480, 720, 960, 1280]}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,29,47,0.02),rgba(18,29,47,0.62))]" />
                <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/35 bg-white/88 p-5 backdrop-blur-xl">
                  <p className="section-kicker">{project.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-ink-900">{project.title}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-7 text-ink-500">{project.description}</p>
                <div className="mt-5 grid gap-3">
                  {project.points.map((point) => (
                    <p key={point} className="inline-flex items-center gap-2 text-sm text-ink-600">
                      <CheckCircle2 size={15} className="text-gold-600" />
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(18rem,1.08fr)]">
          <Reveal className="glass-panel p-7 sm:p-8">
            <p className="section-kicker">Verified Neighborhood Insights</p>
            <h2 className="mt-3 text-5xl font-semibold leading-[0.95] text-ink-900">
              Locality signals that help buyers trust the shortlist faster
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {neighborhoodInsights.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-[28px] border border-[#ece1d0] bg-[#fbf8f2] p-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
                      <Icon size={20} />
                    </span>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-ink-900">{item.title}</p>
                      <span className="rounded-full border border-[#ddd1be] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">
                        {item.value}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-ink-500">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal className="glass-panel p-7 sm:p-8">
              <p className="section-kicker">Hyperlocal Expert Videos</p>
              <h2 className="mt-3 text-5xl font-semibold leading-[0.95] text-ink-900">
                Premium video placeholders for site briefs and micro-market explainers
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {expertVideoSnippets.map((item, index) => (
                  <div key={item.title} className="rounded-[28px] border border-[#ece1d0] bg-[#fbf8f2] p-4">
                    <div className="relative overflow-hidden rounded-[22px] bg-[#0b1525] px-4 py-12 text-white">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.22),transparent_58%)]" />
                      <div className="relative flex flex-col items-start gap-3">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/10 backdrop-blur-xl">
                          <PlayCircle size={22} />
                        </span>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-200">{item.duration}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-lg font-semibold text-ink-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-ink-500">{item.description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-ink-400">
                      Placeholder for future expert reels
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="glass-panel surface-grid p-7 sm:p-8" delay={0.08}>
              <p className="section-kicker">Luxury Testimonials</p>
              <h2 className="mt-3 text-5xl font-semibold leading-[0.95] text-ink-900">
                Trust notes that feel premium without pretending to be fabricated reviews
              </h2>

              <div className="mt-8 space-y-4">
                {TESTIMONIAL_STYLE_NOTES.map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-[#ece2d3] bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-700">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-ink-900">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-ink-500">{item.quote}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="contact" className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(18rem,0.8fr)_minmax(0,1.04fr)]">
          <Reveal className="glass-panel p-7 sm:p-8">
            <p className="section-kicker">Who This Helps Most</p>
            <h2 className="mt-3 text-5xl font-semibold leading-[0.95] text-ink-900">
              Clearer journeys for buyers, investors, and builders
            </h2>
            <div className="mt-8 space-y-4">
              {BUYER_JOURNEY.map((item) => (
                <div key={item.title} className="rounded-[28px] border border-[#ece1d0] bg-[#fbf8f2] p-5">
                  <p className="section-kicker">{item.title}</p>
                  <p className="mt-3 text-2xl font-semibold text-ink-900">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-ink-500">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SERVICE_PILLARS.map((item) => {
                const Icon = serviceIcons[item.icon] || Building2;

                return (
                  <div key={item.title} className="rounded-[26px] border border-[#ece1d0] bg-white p-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
                      <Icon size={18} />
                    </span>
                    <p className="mt-4 text-lg font-semibold text-ink-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-ink-500">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal className="glass-panel p-7 sm:p-8" delay={0.06}>
            <p className="section-kicker">Mortgage / EMI Calculator</p>
            <h2 className="mt-3 text-4xl font-semibold leading-[0.95] text-ink-900">
              Quick monthly planning for premium buyers
            </h2>

            <div className="mt-6 grid gap-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Property Value</span>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  name="propertyValue"
                  value={emiForm.propertyValue}
                  onChange={handleEmiChange}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Down Payment</span>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  name="downPayment"
                  value={emiForm.downPayment}
                  onChange={handleEmiChange}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Interest Rate (%)</span>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  step="0.01"
                  name="annualRate"
                  value={emiForm.annualRate}
                  onChange={handleEmiChange}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Tenure (Years)</span>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  name="tenureYears"
                  value={emiForm.tenureYears}
                  onChange={handleEmiChange}
                />
              </label>
            </div>

            <div className="mt-6 grid gap-3">
              <SummaryMetric label="Loan Principal" value={formatCurrency(emiSummary.principal)} />
              <SummaryMetric label="Estimated Monthly EMI" value={formatCurrency(emiSummary.monthlyEmi)} />
              <SummaryMetric label="Total Interest" value={formatCurrency(emiSummary.totalInterest)} />
            </div>

            <div className="mt-6 rounded-[26px] border border-[#ece1d0] bg-[#fbf8f2] p-4 text-sm leading-7 text-ink-500">
              This is a premium planning estimate. Final loan offers depend on lender terms, tenure, and profile verification.
            </div>
          </Reveal>

          <Reveal id="consultation" delay={0.12}>
            <LeadCaptureForm
              title="Book a Premium Consultation"
              description="Share your shortlist, budget, or site visit requirement and Sagar Infra will coordinate the next step."
              submitLabel="Request Premium Callback"
              successMessage="Thanks, your premium consultation request has been shared successfully."
              source="contact"
              showEmail
              showLocation
              serviceOptions={CONTACT_SERVICE_OPTIONS}
              requirementSeed="I want a premium shortlist and a guided site visit plan."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
};

const FeaturedPropertySkeletons = () => (
  <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-[36px] border border-[#e7dccb] bg-white shadow-[0_28px_70px_rgba(8,16,28,0.08)]"
      >
        <div className="skeleton-shimmer aspect-[4/4.25]" />
        <div className="space-y-4 p-5">
          <div className="skeleton-shimmer h-8 rounded-full" />
          <div className="grid grid-cols-3 gap-3">
            <div className="skeleton-shimmer h-16 rounded-[20px]" />
            <div className="skeleton-shimmer h-16 rounded-[20px]" />
            <div className="skeleton-shimmer h-16 rounded-[20px]" />
          </div>
          <div className="skeleton-shimmer h-24 rounded-[24px]" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="skeleton-shimmer h-12 rounded-full" />
            <div className="skeleton-shimmer h-12 rounded-full" />
            <div className="skeleton-shimmer h-12 rounded-full" />
            <div className="skeleton-shimmer h-12 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SummaryMetric = ({ label, value }) => (
  <div className="rounded-[24px] border border-[#ece1d0] bg-[#fbf8f2] px-4 py-4">
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-700">{label}</p>
    <p className="mt-2 text-lg font-semibold text-ink-900">{value}</p>
  </div>
);

const SectionHeading = ({ kicker, title, copy }) => (
  <div className="max-w-4xl">
    <p className="section-kicker">{kicker}</p>
    <h2 className="section-title-luxury mt-3 text-ink-900">{title}</h2>
    {copy ? <p className="mt-4 max-w-3xl text-sm leading-8 text-ink-500 sm:text-base">{copy}</p> : null}
  </div>
);

export default HomePage;
