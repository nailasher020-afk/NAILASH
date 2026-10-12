import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Phone, MapPin, Send, HelpCircle, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const AboutView: React.FC = () => {
  const { storeSettings, setActiveView } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
          Our Heritage
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-stone-900">
          The Nailash Story
        </h1>
        <p className="text-stone-500 text-sm max-w-lg mx-auto font-light">
          "Elegance, Made for You" — Founded upon a passionate revival of authentic South Asian fabric craftsmanship and timeless modern styling.
        </p>
      </div>

      <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-md bg-stone-100">
        <img
          src={normalizeAssetUrl('/assets/hero_fashion_editorial.jpg')}
          alt="Nailash Atelier"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.dataset.triedFallback !== 'true') {
              target.dataset.triedFallback = 'true';
              target.src = fallbackProductImage;
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
        <div className="space-y-4">
          <h2 className="text-xl font-serif-title font-semibold text-stone-900">
            Artisanal Preservation
          </h2>
          <p>
            At Nailash, every collection begins in the hands of master karigars (artisans) in Lahore and Multan who have inherited generations of needlework dexterity. We honor traditional tilla, zardozi, marodi, and mirror embroideries by uniting them with lightweight, breathable fabrics.
          </p>
          <p>
            Our focus is slow luxury. We produce in disciplined limited batches to ensure uncompromised finishing, generous seam allowances, and lasting heirloom quality.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-serif-title font-semibold text-stone-900">
            The Modern Silhouette
          </h2>
          <p>
            Luxury clothing must move with effortless grace. From fluid silk chiffon dupattas to structural raw silk waistcoats and prince coats, our cuts celebrate poise, ease, and understated distinction.
          </p>
          <p>
            Whether wearing an unstitched lawn creation on a balmy summer afternoon or stepping into an organza peshwas for an evening gala, Nailash ensures you feel revered, graceful, and unquestionably elegant.
          </p>
        </div>
      </div>

      <div className="p-8 bg-[#f5f1dc] rounded-xl border border-stone-200 text-center space-y-3">
        <h3 className="font-serif-title text-2xl text-stone-900">Experience Nailash In Person</h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          Visit our flagship atelier gallery on MM Alam Road, Gulberg III, Lahore, for bespoke bridal consultations and custom made-to-measure tailoring.
        </p>
        <button
          onClick={() => setActiveView('contact')}
          className="px-6 py-2.5 bg-stone-900 text-[#FCF9EA] text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors"
        >
          Book An Atelier Appointment
        </button>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { storeSettings, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your message has been received. Our concierge will contact you within 2 hours.', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
          Customer Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-stone-900">
          Contact Nailash Atelier
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          We are dedicated to providing exemplary assistance for orders, custom sizing, and payment support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
            Atelier Directory
          </h2>

          <div className="space-y-4 text-xs text-stone-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#DB9558] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Flagship Atelier Gallery</strong>
                <p>{storeSettings.address}</p>
                <p>{storeSettings.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#97A87A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Telephone & WhatsApp Direct</strong>
                <p>Phone: {storeSettings.phone}</p>
                <p>WhatsApp Concierge: {storeSettings.whatsapp}</p>
                <p className="text-[11px] text-stone-400">Monday - Saturday: 10:00 AM – 9:00 PM PKT</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#A8BBA3] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Email Inquiries</strong>
                <p>{storeSettings.supportEmail}</p>
                <p className="text-[11px] text-stone-400">Response within 2-4 hours</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FCF9EA] border border-stone-200 rounded-lg text-xs space-y-1">
            <p className="font-semibold text-stone-800">JazzCash Payment Assistance:</p>
            <p className="text-stone-600">
              Need help verifying your JazzCash TID or account transfer? WhatsApp our finance desk at <strong>{storeSettings.whatsapp}</strong> with your Order ID.
            </p>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
            Send an Inquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XXXXXXXXX"
                className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Message / Inquiry Details</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you today? Feel free to ask about sizing, fabric care, or order customisation..."
                className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#DB9558] text-stone-950 uppercase tracking-wider font-semibold rounded hover:bg-[#c98345] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FaqView: React.FC = () => {
  const faqs = [
    {
      q: 'How does JazzCash payment work on Nailash?',
      a: 'During checkout, select JazzCash. You will see our official Merchant Mobile Account number (03001234567, Title: NAILASH APPAREL PVT LTD). Simply transfer the total via your JazzCash App or *786#, enter your sender number and transaction reference ID (TID). Your order will immediately be logged, and will be confirmed once validated by our finance desk.'
    },
    {
      q: 'Is Cash on Delivery (COD) supported nationwide?',
      a: 'Yes, we offer Cash on Delivery across all cities, towns, and districts in Pakistan. You pay in cash when the courier rider delivers your package.'
    },
    {
      q: 'What is your shipping timeline & cost?',
      a: 'We offer complimentary express shipping on all orders over Rs. 15,000. For orders below Rs. 15,000, a flat standard courier fee of Rs. 350 applies. Delivery within Lahore and Karachi takes 1-2 working days; other cities take 2-4 working days.'
    },
    {
      q: 'Can I exchange my outfit if the size does not fit?',
      a: 'Yes! We offer a hassle-free 7-day exchange policy. If the size is unsuitable, simply contact our WhatsApp concierge (+92 300 1234567) within 7 days of delivery. The item must be unworn and in its original luxury box with tags intact.'
    },
    {
      q: 'Are your fabrics pure?',
      a: 'Every fabric is clearly detailed on the product page. Our luxury lawn is 100% combed fine count cotton, our raw silks are pure 80-gram silk, and our organzas are genuine pure silk organza.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
          Help & Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-stone-900">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-stone-200/80 space-y-2">
            <h2 className="text-sm font-semibold text-stone-900">{f.q}</h2>
            <p className="text-xs text-stone-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6 text-xs text-stone-700 leading-relaxed">
      <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
        Privacy & Data Protection Policy
      </h1>
      <p className="text-stone-500">Effective Date: March 2026</p>
      <p>
        Nailash Apparel (Pvt) Ltd ("Nailash", "we", "us") values your trust and is committed to protecting your personal information. This Privacy Policy outlines how we collect, store, and safeguard your details when you interact with our online store and atelier services.
      </p>
      <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider pt-2">
        1. Information We Collect
      </h2>
      <p>
        We collect personal details necessary to fulfill your orders, including full name, shipping destination, phone number, email address, and transaction reference numbers (e.g. JazzCash reference IDs). We never store raw credit card numbers or private banking credentials.
      </p>
      <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider pt-2">
        2. Order Processing & Security
      </h2>
      <p>
        Your data is strictly utilized to process transactions, dispatch packages via insured couriers (TCS, Leopards, DHL), and provide order status notifications. We do not sell or rent customer data to third-party advertisers.
      </p>
      <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider pt-2">
        3. Contacting Our Data Officer
      </h2>
      <p>
        If you wish to review, update, or delete your account records, please reach out to our privacy desk at care@nailashfashion.com.
      </p>
    </div>
  );
};

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6 text-xs text-stone-700 leading-relaxed">
      <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
        Terms & Conditions of Sale
      </h1>
      <p className="text-stone-500">Last Revised: March 2026</p>
      <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider pt-2">
        1. Order Acceptance & Contract
      </h2>
      <p>
        Placement of an order constitutes an offer to purchase luxury apparel. Nailash reserves the right to decline or cancel orders in cases of pricing inaccuracies, suspected fraudulent payment references, or sudden fabric stock depletion.
      </p>
      <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider pt-2">
        2. JazzCash & COD Policies
      </h2>
      <p>
        For JazzCash orders, proof of payment reference (TID) must match the registered payment receipt. Orders remain marked Pending until confirmed. For Cash on Delivery, customers agree to be physically present and have exact cash ready at the confirmed shipping address.
      </p>
      <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider pt-2">
        3. Color & Sizing Nuances
      </h2>
      <p>
        Because our garments incorporate natural dyeing, hand block-printing, and hand embroidery, subtle variations in thread sheen and tone are authentic signatures of bespoke craftsmanship.
      </p>
    </div>
  );
};
