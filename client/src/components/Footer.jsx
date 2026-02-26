const Footer = () => (
  <footer className="bg-slate-900 text-slate-200 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6 text-sm">
      <div>
        <h3 className="font-bold text-white">Mahadev Property</h3>
        <p className="mt-2">Trusted village and city property dealer for plots, houses, flats and commercial spaces.</p>
      </div>
      <div>
        <h4 className="font-semibold text-white">Contact</h4>
        <p className="mt-2">Phone: +91 99999 99999</p>
        <p>WhatsApp: +91 99999 99999</p>
        <p>Office: Main Road, City Center</p>
      </div>
      <div>
        <h4 className="font-semibold text-white">Quick Links</h4>
        <ul className="mt-2 space-y-1">
          <li>Buy Property</li><li>Rent Property</li><li>Book Site Visit</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
