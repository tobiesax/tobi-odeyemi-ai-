import React from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  Mail,
  MapPin,
  Menu,
  Music2,
  Phone,
  Play,
  Star,
  SunMedium,
  X,
} from "lucide-react";
import "./styles.css";
const AdminPanel = React.lazy(() => import("./ai/AdminPanel"));

const navItems = ["About", "Music", "Services", "Clients", "Gallery", "Reviews", "FAQ"];

const genres = [
  { label: "Contemporary Jazz", icon: Music2 },
  { label: "Afro Fusion", icon: SunMedium },
  { label: "Afro Pop", icon: Headphones },
  { label: "Soul & R&B", icon: Heart },
];

const stats = [
  { value: "10+", label: "Years Experience", icon: CalendarDays },
  { value: "500+", label: "Events Performed", icon: Headphones },
  { value: "100%", label: "Client Satisfaction", icon: Star },
];

const venues = [
  "Sandton Convention Centre",
  "Four Seasons",
  "Radisson",
  "Montecasino",
  "Sax On Main",
];

const youtubeVideos = [
  ["m2pTlvfWdGY", "FOLA - Caricature Sax Cover"],
  ["jaXf0gpQssM", "Magumba Sax Version"],
  ["LNT4eitqmn8", "Gratitude - Smooth Jazz Sax"],
  ["TuFuzLOQohI", "Deep Worship Saxophone"],
];

const serviceCards = [
  {
    eyebrow: "01 - Events",
    name: "Private Functions",
    detail: "2 sets / 45 mins each",
    featured: true,
    copy: "Elevate personal occasions with live saxophone music that creates atmosphere, elegance and lasting memory.",
    items: ["Luxury weddings", "Birthday celebrations", "Private dinners", "Anniversary celebrations"],
  },
  {
    eyebrow: "02 - Business",
    name: "Corporate Functions",
    detail: "2 sets / 45 mins each",
    copy: "Impress clients, colleagues and stakeholders with world-class live saxophone at your next gala or launch.",
    items: ["Corporate galas", "Product launches", "Conferences and summits", "Year-end functions"],
  },
  {
    eyebrow: "03 - Residencies",
    name: "Hotels & Restaurants",
    detail: "Recurring nights / residency",
    copy: "Bring a signature live music experience to your venue with a tailored saxophone residency for guests and diners.",
    items: ["Weekly or monthly residencies", "Dinner and lounge sets", "Tailored genre programming", "Flexible scheduling"],
  },
];

const clientLogos = ["Cisco", "American Chamber of Commerce South Africa", "Deloitte", "Vodacom", "Sun City", "Emperors Palace", "Powerstar", "AFGRI"];

const galleryItems = [
  { title: "Garden Performance", src: "/gallery-01-optimized.jpg", tone: "mono" },
  { title: "CEIAS Awards", src: "/gallery-02-optimized.jpg", tone: "event" },
  { title: "American Chamber of Commerce South Africa", src: "/gallery-03-optimized.jpg", tone: "portrait" },
  { title: "Deloitte Impact Awards", src: "/gallery-04-optimized.jpg", tone: "event" },
  { title: "Cisco Partner Event", src: "/gallery-05-optimized.jpg", tone: "portrait" },
  { title: "Vodacom Outdoor Function", src: "/gallery-06-optimized.jpg", tone: "lifestyle" },
  { title: "Powerstar Conference", src: "/gallery-07-optimized.jpg", tone: "portrait" },
  { title: "AFGRI Experience", src: "/gallery-08-optimized.jpg", tone: "wide" },
];

const reviews = [
  {
    initials: "SK",
    name: "Sarah K.",
    event: "Wedding / March 2024",
    text: "Tobi absolutely made our wedding. His saxophone set the most beautiful atmosphere and every guest commented on it.",
    source: "Google Review",
  },
  {
    initials: "JM",
    name: "James M.",
    event: "Corporate Event / Jan 2024",
    text: "Professional, punctual and incredibly talented. Tobi elevated our year-end function to another level entirely.",
    source: "Facebook Review",
  },
  {
    initials: "NZ",
    name: "Nolwazi Z.",
    event: "Private Event / Dec 2023",
    text: "The blend of Afro jazz and gospel was exactly what we needed. Tobi read the room perfectly and delivered.",
    source: "Direct Testimonial",
  },
  {
    initials: "TM",
    name: "Thabo M.",
    event: "Awards Gala / Nov 2023",
    text: "A polished, world-class performance. Tobi understood the brief immediately and exceeded every expectation.",
    source: "Google Review",
  },
  {
    initials: "AR",
    name: "Aisha R.",
    event: "Hotel Residency / Aug 2023",
    text: "Our guests ask for Tobi by name now. Booking him for a recurring residency was one of our best decisions this year.",
    source: "Direct Testimonial",
  },
  {
    initials: "DP",
    name: "David P.",
    event: "Product Launch / June 2023",
    text: "Tobi brought a level of sophistication to our launch that our brand absolutely needed. Outstanding from start to finish.",
    source: "Facebook Review",
  },
];

const faqs = [
  ["Do you provide your own equipment?", "Yes. Tobi arrives with his own professional-grade saxophone and backing track system. A basic PA or sound system is helpful for larger venues."],
  ["How long does a performance last?", "Standard performances are 1-2 hours with short breaks. For galas and weddings, Tobi can perform 2-3 sets across the evening."],
  ["How far in advance should I book?", "Weekends book quickly, especially from October to December and in April. Three to four weeks notice is recommended."],
  ["Do you travel outside Johannesburg?", "Absolutely. Tobi is available across South Africa and can consider international bookings depending on logistics."],
  ["What genres do you play?", "Contemporary Jazz, Afro Fusion, Afro Pop, Soul and R&B, Gospel, and tailored event sets."],
  ["How is payment structured?", "A 50% deposit confirms the booking, with the balance due on the event day. EFT, Yoco and payment links are supported."],
];

const reelSlots = [
  { title: "Restaurant Performance Reel", src: "/reel-corporate-event.mp4", poster: "/reel-corporate-event-poster.jpg" },
  { title: "Wedding / Private Function", src: "/reel-private-function.mp4", poster: "/reel-private-function-poster.jpg" },
  { title: "Corporate Event Reel", src: "/reel-worship-gospel.mp4", poster: "/reel-worship-gospel-poster.jpg" },
  { title: "Hotel / Restaurant Residency", src: "/reel-hotel-residency-new.mp4", poster: "/reel-hotel-residency-new-poster.jpg" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.19, 1, 0.22, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.16 } },
};

function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed left-0 top-0 z-50 w-full border-b border-gold/35 bg-emerald-deep/78 backdrop-blur-xl"
    >
      <nav className="nav-shell mx-auto flex h-20 max-w-[1720px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-24">
        <a href="#" className="logo-lockup nav-logo" aria-label="Tobi Odeyemi home">
          <img src="/tobi-logo.png" alt="Tobi Odeyemi" className="nav-logo-img" />
        </a>

        <div className="hidden items-center gap-8 md:flex md:gap-6 lg:gap-9 xl:gap-12">
          {navItems.map((item) => (
            <a className="nav-link" href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a className="book-button nav-book" href="#book">
            Book Now
            <ArrowRight size={18} strokeWidth={1.7} />
          </a>
        </div>

        <button
          className="mobile-menu-button md:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gold/20 bg-[#021b16]/95 px-5 py-6 md:hidden"
        >
          <div className="grid gap-4">
            {navItems.map((item) => (
              <a className="nav-link w-fit" href={`#${item.toLowerCase()}`} key={item}>
                {item}
              </a>
            ))}
            <a className="book-button mt-2 w-fit" href="#book">
              Book Now
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function BackgroundAtmosphere() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 28, -8, 0], y: [0, -20, 8, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="ambient-glow ambient-glow-left"
      />
      <motion.div
        animate={{ x: [0, -22, 12, 0], y: [0, 18, -12, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="ambient-glow ambient-glow-right"
      />
      <div className="gold-wash" />
      <div className="noise-layer" />
      <div className="rings rings-one" />
      <div className="rings rings-two" />
      <div className="particle-field">
        {Array.from({ length: 18 }).map((_, index) => (
          <motion.span
            key={index}
            animate={{ opacity: [0.1, 0.45, 0.1], y: [0, -18, 0] }}
            transition={{
              duration: 5 + (index % 5),
              delay: index * 0.37,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${8 + ((index * 13) % 88)}%`,
              top: `${18 + ((index * 17) % 68)}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GenreTags() {
  const rowOne = genres.slice(0, 2);
  const rowTwo = genres.slice(2);
  return (
    <motion.div variants={fadeUp} className="genre-tag-rows">
      <div className="genre-tag-row">
        {rowOne.map(({ label, icon: Icon }) => (
          <span className="genre-pill" key={label}>
            <Icon size={16} strokeWidth={1.6} />
            {label}
          </span>
        ))}
      </div>
      <div className="genre-tag-row">
        {rowTwo.map(({ label, icon: Icon }) => (
          <span className="genre-pill" key={label}>
            <Icon size={16} strokeWidth={1.6} />
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function StatsCard() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.85, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      className="stats-card"
      aria-label="Performance statistics"
    >
      {stats.map(({ value, label, icon: Icon }, index) => (
        <div className="stat-item" key={label}>
          <Icon className="mx-auto text-gold-bright" size={34} strokeWidth={1.35} />
          <strong>{value}</strong>
          <span>{label}</span>
          {index < stats.length - 1 && <i aria-hidden="true" />}
        </div>
      ))}
    </motion.aside>
  );
}
function StatsStrip() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: 0.72 }}
      className="stats-strip"
      aria-label="Performance highlights"
    >
      {stats.map(({ value, label }) => (
        <div className="stat-tile" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </motion.section>
  );
}
function ImageStage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.42, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="image-stage"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="portrait-wrap"
      >
        <picture>
          <source
            type="image/webp"
            srcSet="/tobi-hero-green-suit-640.webp 640w, /tobi-hero-green-suit-768.webp 768w, /tobi-hero-green-suit-1024.webp 1024w"
            sizes="(max-width: 768px) 88vw, (max-width: 1200px) 72vw, 540px"
          />
          <img
            src="/tobi-hero-green-suit-768.png"
            srcSet="/tobi-hero-green-suit-640.png 640w, /tobi-hero-green-suit-768.png 768w, /tobi-hero-green-suit.png 1024w"
            sizes="(max-width: 768px) 88vw, (max-width: 1200px) 72vw, 540px"
            width="1024"
            height="1536"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            alt="Tobi Odeyemi holding a saxophone in a green tailored suit"
            className="portrait-image"
          />
        </picture>
      </motion.div>
    </motion.div>
  );
}

function TrustBar() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: 1.05 }}
      className="trust-bar"
      aria-label="Trusted venues and brands"
    >
      <p>Trusted by<br />leading brands &amp; venues</p>
      <div className="venue-marquee-mask">
        <div className="venue-strip">
          {venues.map((venue) => (
            <span key={venue}>{venue}</span>
          ))}
          {venues.map((venue) => (
            <span key={`${venue}-dup`} aria-hidden="true">{venue}</span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function WhatsAppIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.474.151.905.129 1.246.078.38-.057 1.171-.477 1.336-.938.164-.46.164-.854.114-.937-.049-.084-.182-.133-.38-.232" />
    </svg>
  );
}

function SectionHeader({ eyebrow, title, dark = false }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      <p className={dark ? "section-eyebrow section-eyebrow-dark" : "section-eyebrow"}>{eyebrow}</p>
      <h2 className={dark ? "section-title section-title-light" : "section-title"}>{title}</h2>
      <span className="section-rule" />
    </motion.div>
  );
}

function ReelShowcase() {
  return (
    <div className="reel-showcase-shell">
      <div className="reel-slot-grid">
        {reelSlots.map((item) => (
          <article className={item.src ? "reel-slot has-video" : "reel-slot"} key={item.title}>
            {item.src ? (
              <video src={item.src} poster={item.poster} controls playsInline preload="metadata" />
            ) : (
              <div className="reel-placeholder" aria-hidden="true">
                <i><Play size={20} fill="currentColor" strokeWidth={1.5} /></i>
                <span>Video coming soon</span>
              </div>
            )}
            <div className="reel-slot-caption">
              <strong>{item.title}</strong>
            </div>
          </article>
        ))}
      </div>
      <div className="reel-showcase-note">
        <a href="https://www.instagram.com/officialtobiodeyemi" target="_blank" rel="noreferrer">
          Follow on Instagram
          <ArrowRight size={16} strokeWidth={1.8} />
        </a>
      </div>
    </div>
  );
}

function AboutSection() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <section className="content-section about-section" id="about">
      <div className="section-inner about-layout">
        <motion.div className="about-visual" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <img
            src="/about-me.jpg"
            alt="Tobi Odeyemi seated with a saxophone in formal performance attire"
            loading="lazy"
            decoding="async"
          />
          <span />
        </motion.div>
        <div className="about-content">
          <SectionHeader eyebrow="About Tobi" title="A Voice for Every Stage" />
          <p>
            Tobi Odeyemi is one of Johannesburg's most sought-after saxophonists, blending contemporary jazz,
            Afro fusion, soul and gospel into an unforgettable live experience.
          </p>
          <p>
            With over 20 years on stage, Tobi has performed at marquee events across South Africa and
            internationally, bringing warmth, technical mastery and raw passion to every note.
          </p>
          <button className="luxury-outline light about-readmore" type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "Show Less" : "Read More"}
            <ChevronDown className={expanded ? "rotate-180" : ""} size={18} />
          </button>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="about-more">
              <p>
                Since relocating to South Africa in 2010, Tobi has performed before President Cyril Ramaphosa,
                Panyaza Lesufi and VP Yemi Osinbajo of Nigeria, with appearances at Sun International,
                Montecasino, Sun City and the Nedbank Golf Challenge.
              </p>
              <div className="highlight-grid">
                {["President Cyril Ramaphosa", "Panyaza Lesufi", "Nedbank Golf Challenge"].map((item) => (
                  <div className="highlight-card" key={item}>
                    <span>Notable</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function MusicSection() {
  return (
    <section className="content-section ivory-section" id="music">
      <span className="anchor-offset" id="showreel" aria-hidden="true" />
      <div className="section-inner">
        <SectionHeader eyebrow="Watch & Follow" title="Music & Instagram" />
        <div className="music-layout">
          <div className="reels-column">
            <p className="section-copy">A dedicated reel library for short performance clips, event highlights and behind-the-scenes moments.</p>
            <a className="luxury-outline light" href="https://www.instagram.com/officialtobiodeyemi" target="_blank" rel="noreferrer">
              Follow on Instagram
              <ArrowRight size={18} />
            </a>
            <ReelShowcase />
          </div>
          <div className="youtube-column">
            <div className="media-heading">
              <span>Latest Videos on YouTube</span>
              <a href="https://youtube.com/@tobiesax" target="_blank" rel="noreferrer">@tobiesax</a>
            </div>
            <div className="video-grid">
              {youtubeVideos.map(([id, title]) => (
                <a className="video-card" href={`https://youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer" key={id}>
                  <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} loading="lazy" decoding="async" />
                  <i><Play size={18} fill="currentColor" /></i>
                  <strong>{title}</strong>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="content-section deep-section" id="services">
      <div className="section-inner">
        <SectionHeader eyebrow="What I Offer" title="Services" dark />
        <p className="section-copy light-copy">
          From intimate private gatherings to large-scale corporate galas, Tobi brings sophisticated live saxophone
          tailored to your event's atmosphere and audience.
        </p>
        <div className="services-grid">
          {serviceCards.map((service) => (
            <article className={service.featured ? "service-card featured" : "service-card"} key={service.name}>
              <span>{service.eyebrow}</span>
              <h3>{service.name}</h3>
              <div className="price-row">
                <em>{service.detail}</em>
              </div>
              <p>{service.copy}</p>
              <ul>
                {service.items.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
              <a href="#book">Book a Performance <ArrowRight size={17} /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsSection() {
  return (
    <section className="content-section ivory-section" id="clients">
      <div className="section-inner">
        <SectionHeader eyebrow="Trusted By" title="Clients & Partners" />
        <p className="section-copy">From global tech summits to prestigious award ceremonies, Tobi has performed for respected organisations across South Africa and beyond. His client list spans multinational technology firms, leading financial institutions and luxury hospitality groups, each booking him for the same reason: a performance that reads the room and elevates the occasion.</p>
        <p className="section-copy">From corporate galas at Sandton's premier venues to a celebrated outdoor performance at the Nedbank Golf Challenge in Sun City, Tobi has built a reputation for delivering a consistent, world-class standard regardless of the size or setting of the event.</p>
        <a className="luxury-outline light" href="#book">
          Book a Performance
          <ArrowRight size={17} strokeWidth={1.7} />
        </a>
        <div className="client-marquee-mask" style={{ marginTop: "4rem" }}>
          <div className="client-marquee">
            {[...clientLogos, ...clientLogos].map((logo, index) => (
              <span key={`${logo}-${index}`}>{logo}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section className="content-section gallery-section" id="gallery">
      <div className="section-inner">
        <SectionHeader eyebrow="In the Moment" title="Gallery" />
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <motion.figure
              className={`gallery-card ${index === 0 || item.tone === "wide" ? "wide" : ""} ${item.tone || ""}`}
              key={item.title}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
              <figcaption>{item.title}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [activeReview, setActiveReview] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % reviews.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const review = reviews[activeReview];
  const previousReview = () => setActiveReview((current) => (current - 1 + reviews.length) % reviews.length);
  const nextReview = () => setActiveReview((current) => (current + 1) % reviews.length);

  return (
    <section className="content-section black-section" id="reviews">
      <div className="section-inner">
        <SectionHeader eyebrow="What People Say" title="Reviews" dark />
        <div className="reviews-carousel" aria-roledescription="carousel" aria-label="Client reviews">
          <button className="review-arrow" type="button" onClick={previousReview} aria-label="Previous review">
            <ChevronLeft size={22} />
          </button>
          <article className="review-card review-card-featured" key={review.name}>
            <div className="review-top">
              <i aria-hidden="true">{review.initials}</i>
              <div><strong>{review.name}</strong><span>{review.event}</span></div>
            </div>
            <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
            <p>"{review.text}"</p>
            <em>{review.source}</em>
          </article>
          <button className="review-arrow" type="button" onClick={nextReview} aria-label="Next review">
            <ChevronRight size={22} />
          </button>
        </div>
        <div className="review-dots" aria-label="Choose review">
          {reviews.map((item, index) => (
            <button
              className={index === activeReview ? "is-active" : ""}
              type="button"
              key={item.name}
              onClick={() => setActiveReview(index)}
              aria-label={`Show review from ${item.name}`}
              aria-pressed={index === activeReview}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const [formStatus, setFormStatus] = React.useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setFormStatus("sending");

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const fields = Object.fromEntries(formData.entries());

    const inquiryPayload = {
      name: `${fields.first_name || ""} ${fields.last_name || ""}`.trim(),
      firstName: fields.first_name || "",
      lastName: fields.last_name || "",
      email: fields.email || "",
      phone: fields.phone || "",
      eventType: fields.event_type || "",
      eventDate: fields.event_date || "",
      guests: fields.guest_count || "",
      notes: fields.message || "",
      contact: [fields.email, fields.phone].filter(Boolean).join(" / "),
      source: "website-booking-form",
    };

    try {
      const response = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryPayload),
      });

      if (response.ok) {
        setFormStatus("sent");
        formEl.reset();
        return;
      }

      setFormStatus("error");
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <section className="content-section ivory-section booking-section" id="book">
      <div className="section-inner">
        <SectionHeader eyebrow="Get in Touch" title="Book Tobi for Your Event" />
        <div className="booking-panel">
          <div className="contact-column">
            <p className="section-copy">Available for private and corporate functions across South Africa and internationally.</p>
            <div className="availability-list" aria-label="Booking notes">
              <span><Check size={16} />Replies within 24 hours</span>
              <span><CalendarDays size={16} />2 weeks' notice preferred</span>
              <span><Check size={16} />50% deposit confirms booking</span>
            </div>
            <a href="tel:+27735074691"><Phone size={19} />073 507 4691</a>
            <a href="mailto:tobisax@gmail.com"><Mail size={19} />tobisax@gmail.com</a>
            <span><MapPin size={19} />Johannesburg, South Africa</span>
          </div>
          <form className="booking-form" onSubmit={handleSubmit}>
            <h3>Send an Enquiry</h3>
            <p className="form-subnote">Tell us about your event and we'll confirm availability and next steps within 24 hours.</p>
            <div className="form-row"><input name="first_name" required placeholder="First name" /><input name="last_name" required placeholder="Last name" /></div>
            <input name="email" required type="email" placeholder="Email" />
            <input name="phone" type="tel" placeholder="Phone / WhatsApp" />
            <select name="event_type" required defaultValue=""><option value="" disabled>Event type</option><option>Wedding</option><option>Corporate Event</option><option>Private Party</option><option>Hotel / Restaurant Residency</option><option>Other</option></select>
            <div className="form-row"><input name="event_date" type="date" required /><input name="guest_count" placeholder="Approx. guests" /></div>
            <textarea name="message" placeholder="Tell Tobi about your event, venue, vibe and special requests." />
            <button type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Sending..." : "Send Enquiry"}</button>
            {formStatus === "sent" && <p className="form-success">Enquiry sent. Tobi will be in touch within 24 hours.</p>}
            {formStatus === "error" && <p className="form-error">Something went wrong. Please try again or WhatsApp Tobi directly.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="content-section faq-section" id="faq">
      <div className="section-inner">
        <SectionHeader eyebrow="Good to Know" title="Frequently Asked Questions" />
        <div className="faq-grid">
          {faqs.map(([question, answer], index) => (
            <article className={open === index ? "faq-item open" : "faq-item"} key={question}>
              <button type="button" onClick={() => setOpen(open === index ? -1 : index)}>
                {question}
                <ChevronDown size={20} />
              </button>
              {open === index && <p>{answer}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerLinks = [...navItems, "Booking"];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src="/tobi-logo.png" alt="Tobi Odeyemi" className="footer-logo-img" />
          <p>Premium saxophone entertainment for private celebrations, corporate events, hotels and exclusive venues across South Africa.</p>
          <a className="footer-cta" href="#book">Start an enquiry <ArrowRight size={18} /></a>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <span>Explore</span>
          {footerLinks.map((item) => (
            <a href={item === "Booking" ? "#book" : `#${item.toLowerCase()}`} key={item}>{item}</a>
          ))}
        </nav>

        <div className="footer-contact">
          <span>Contact</span>
          <a href="tel:+27735074691"><Phone size={17} />073 507 4691</a>
          <a href="mailto:tobisax@gmail.com"><Mail size={17} />tobisax@gmail.com</a>
          <p><MapPin size={17} />Johannesburg, South Africa</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Tobi Odeyemi. All rights reserved.</span>
        <div className="footer-socials">
          <a href="https://www.instagram.com/officialtobiodeyemi" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://youtube.com/@tobiesax" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>
    </footer>
  );
}

function HeroCopy() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="hero-copy">
      <motion.p variants={fadeUp} className="location-label">
        <MapPin size={18} strokeWidth={1.7} />
        Johannesburg <span>•</span> South Africa
      </motion.p>

      <motion.h1 variants={fadeUp} className="hero-title" id="hero-title">
        <span>Tobi</span>
        <span>Odeyemi</span>
      </motion.h1>

      <motion.p variants={fadeUp} className="hero-kicker">
        Saxophonist
      </motion.p>

      <motion.p variants={fadeUp} className="hero-description">
        Premium saxophone entertainment for corporate events, private functions,
        hotels, restaurants, weddings, and exclusive venues across South Africa.
      </motion.p>

      <motion.div variants={fadeUp} className="hero-actions">
        <a className="book-button hero-primary" href="#book">
          Book Tobi
          <ArrowRight className="button-arrow" size={22} strokeWidth={1.7} />
        </a>
        <a className="showreel-link" href="#showreel">
          <span>Watch Showreel</span>
          <i>
            <Play size={15} fill="currentColor" strokeWidth={1.4} />
          </i>
        </a>
      </motion.div>
    </motion.div>
  );
}
function QuickEnquiryBand() {
  return (
    <section className="quick-enquiry-band" aria-label="Quick booking enquiry">
      <div className="quick-enquiry-inner">
        <div>
          <span>Ready to check availability?</span>
          <strong>Tell Tobi the date, venue and occasion.</strong>
        </div>
        <a className="book-button" href="#book">
          Start Enquiry
          <ArrowRight size={18} strokeWidth={1.7} />
        </a>
      </div>
    </section>
  );
}
function App() {
  const [isAdmin, setIsAdmin] = React.useState(() => window.location.pathname.replace(/\/$/, "") === "/admin");

  React.useEffect(() => {
    const onNav = () => setIsAdmin(window.location.pathname.replace(/\/$/, "") === "/admin");
    window.addEventListener("popstate", onNav);
    return () => window.removeEventListener("popstate", onNav);
  }, []);

  const [showFloatingActions, setShowFloatingActions] = React.useState(false);

  React.useEffect(() => {
    if (isAdmin) return undefined;

    const revealTargets = document.querySelectorAll(".quick-enquiry-band, .content-section, .site-footer");
    revealTargets.forEach((target) => target.classList.add("section-reveal"));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.14 });

    revealTargets.forEach((target) => revealObserver.observe(target));

    return () => revealObserver.disconnect();
  }, [isAdmin]);

  React.useEffect(() => {
    if (isAdmin) return undefined;

    const updateFloatingActions = () => {
      const hero = document.querySelector(".hero-shell");
      if (!hero) return;
      setShowFloatingActions(window.scrollY > hero.offsetHeight - 96);
    };

    updateFloatingActions();
    window.addEventListener("scroll", updateFloatingActions, { passive: true });
    window.addEventListener("resize", updateFloatingActions);

    return () => {
      window.removeEventListener("scroll", updateFloatingActions);
      window.removeEventListener("resize", updateFloatingActions);
    };
  }, [isAdmin]);
  if (isAdmin) {
    return (
      <React.Suspense fallback={<main className="min-h-screen bg-[#021B16] text-ivory" style={{ padding: "3.5rem 1.5rem" }}>Loading admin tools...</main>}>
        <AdminPanel />
      </React.Suspense>
    );
  }

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#021B16] text-ivory">
      <Navbar />
      <section className="hero-shell" aria-labelledby="hero-title">
        <BackgroundAtmosphere />
        <div className="hero-grid">
          <HeroCopy />
          <ImageStage />
        </div>
        <StatsStrip />
        <TrustBar />
      </section>
      <QuickEnquiryBand />
      <MusicSection />
      <ServicesSection />
      <ClientsSection />
      <ReviewsSection />
      <GallerySection />
      <AboutSection />
      <BookingSection />
      <FaqSection />
      <Footer />
      <a className={showFloatingActions ? "back-to-top" : "back-to-top floating-hidden"} href="#top" aria-label="Back to top">
        <ArrowUp size={24} />
      </a>
      <a className={showFloatingActions ? "whatsapp-float" : "whatsapp-float floating-hidden"} href="https://wa.me/27735074691?text=Hi%20Tobi%2C%20I%27d%20like%20to%20book%20you%20for%20an%20event." target="_blank" rel="noreferrer" aria-label="Contact Tobi Odeyemi on WhatsApp">
        <WhatsAppIcon size={30} />
      </a>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

