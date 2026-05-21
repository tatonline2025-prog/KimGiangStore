export type PageDef = {
  title: string;
  subtitle: string;
  body: string;
};

export const defaultPages: Record<string, PageDef> = {
  collections: {
    title: "Our Collections",
    subtitle:
      "Curated artifacts spanning centuries of Vietnamese and East Asian heritage — bronze, jade, ceramics, lacquerwork, and more.",
    body: JSON.stringify([
      {
        heading: "Bronze & Metalwork",
        description:
          "Ceremonial bronzes from the Dong Son culture and dynastic workshops. Each piece carries ritual significance and exceptional craftsmanship.",
        image:
          "https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=800&q=80",
        accent: "#c47b2a",
      },
      {
        heading: "Jade & Gemstone",
        description:
          "Nephrite carvings, bi discs, and pendant jewellery representing power, prosperity, and spiritual protection across the ages.",
        image:
          "https://images.unsplash.com/photo-1558980394-d9cfe2f1f190?auto=format&fit=crop&w=800&q=80",
        accent: "#4dc98e",
      },
      {
        heading: "Ceramics & Porcelain",
        description:
          "Blue-and-white vessels, celadon ware, and imperial glazed pieces from Ly, Tran, Le, and Nguyen kilns.",
        image:
          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
        accent: "#6ba8d4",
      },
      {
        heading: "Lacquer & Woodwork",
        description:
          "Imperial lacquer boxes, scholar's furniture, and ornamental panels decorated with gold leaf and mother-of-pearl inlay.",
        image:
          "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b5?auto=format&fit=crop&w=800&q=80",
        accent: "#c4844a",
      },
      {
        heading: "Devotional & Religious",
        description:
          "Buddha statues, altar figurines, temple bells, and ritual objects from Buddhist and Taoist traditions.",
        image:
          "https://images.unsplash.com/photo-1579519431462-8f8d9b8f5a08?auto=format&fit=crop&w=800&q=80",
        accent: "#c4604a",
      },
      {
        heading: "Scholar's Objects",
        description:
          "Ink stones, seals, manuscript chests, and decorative plaques treasured by literati across dynastic courts.",
        image:
          "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
        accent: "#9b8ac4",
      },
    ]),
  },
  services: {
    title: "Our Services",
    subtitle:
      "Expert authentication, appraisal, and collection management for discerning collectors and institutions worldwide.",
    body: JSON.stringify([
      {
        icon: "🔍",
        heading: "Artifact Authentication",
        description:
          "Scientific and historical authentication using thermoluminescence dating, X-ray fluorescence, and consultation with leading scholars. Every piece is documented and certified.",
      },
      {
        icon: "📜",
        heading: "Provenance Research",
        description:
          "Deep archival research to trace ownership history, export documentation, and dynastic origins. Full COA (Certificate of Authenticity) issued with each artifact.",
      },
      {
        icon: "💎",
        heading: "Independent Appraisal",
        description:
          "RICS-compliant fair-market valuations for insurance, estate planning, charitable donation, and auction purposes. Reports prepared in English and Vietnamese.",
      },
      {
        icon: "📦",
        heading: "Collection Management",
        description:
          "Professional cataloguing, museum-grade storage consultation, and collection inventory management for private collectors and institutions.",
      },
      {
        icon: "✈️",
        heading: "Secure Export & Shipping",
        description:
          "Liaison with Vietnamese Ministry of Culture for export licenses, custom-built crating, climate-controlled freight, and full insurance coverage worldwide.",
      },
      {
        icon: "🤝",
        heading: "Private Brokerage",
        description:
          "Discreet acquisition and sale representation between private parties. We facilitate introductions and ensure legal transfer with complete documentation.",
      },
    ]),
  },
  provenance: {
    title: "Provenance & Authenticity",
    subtitle:
      "Uncompromising trust. Every artifact in our collection carries documented history, verified ownership, and independent authentication.",
    body: JSON.stringify({
      intro:
        "Kim Giang Antiques was founded on the principle that great art should be understood, not merely possessed. Provenance is not a formality — it is the soul of the object.",
      steps: [
        {
          step: "01",
          title: "Initial Assessment",
          detail:
            "Our specialists conduct a preliminary visual and contextual examination to assess period, medium, and cultural origin before any acquisition.",
        },
        {
          step: "02",
          title: "Scientific Testing",
          detail:
            "Select objects undergo thermoluminescence (TL) dating, XRF analysis, and carbon dating where appropriate, performed by accredited independent laboratories.",
        },
        {
          step: "03",
          title: "Scholarly Review",
          detail:
            "We consult with academics at leading Vietnamese and international institutions to validate attribution and historical context.",
        },
        {
          step: "04",
          title: "Archive Research",
          detail:
            "Our provenance team searches auction records, collection catalogues, museum registers, and colonial-era inventories to establish the full ownership chain.",
        },
        {
          step: "05",
          title: "Certificate of Authenticity",
          detail:
            "A comprehensive COA is issued with every piece, including full physical description, scientific test results, scholarly references, and ownership history.",
        },
      ],
      closing:
        "All provenance codes (e.g. KG-COA-1701) are registered in our secure digital archive, allowing collectors to verify authenticity at any future date.",
    }),
  },
  about: {
    title: "About Kim Giang Antiques",
    subtitle:
      "A family legacy of preserving Vietnamese and East Asian heritage for collectors, institutions, and future generations.",
    body: JSON.stringify({
      story:
        "Kim Giang Antiques was established in Hoi An — the ancient trading port that has long been a crossroads of cultures and commerce. Founded by a family with three generations of expertise in Vietnamese antiquities, we began as a small gallery on the banks of the Thu Bon river and have grown into a trusted name for collectors and institutions worldwide.\n\nOur name, Kim Giang (金江), means Golden River — a tribute to the waterway that first carried silk, porcelain, and bronze goods through our ancestral region. Today, we carry on that tradition by bringing exceptional artifacts to collectors with the respect and rigour they deserve.",
      values: [
        {
          title: "Integrity",
          detail:
            "We will never knowingly sell a forgery or an illegally exported object. If any doubt exists, we decline the listing.",
        },
        {
          title: "Scholarship",
          detail:
            "Every object is treated as a historical document. We invest in research because informed collectors are our most enduring relationships.",
        },
        {
          title: "Heritage Preservation",
          detail:
            "We actively support repatriation efforts and collaborate with Vietnamese cultural institutions to keep significant objects accessible to the public.",
        },
        {
          title: "Discretion",
          detail:
            "Private collections deserve private handling. We maintain strict confidentiality for all collector relationships.",
        },
      ],
      team: [
        {
          name: "Nguyen Thi Kim",
          role: "Founder & Director",
          bio: "Third-generation dealer with 30 years of specialist expertise in Vietnamese dynastic bronzes and ceramics.",
        },
        {
          name: "Le Van Giang",
          role: "Head of Provenance Research",
          bio: "Former curator at Vietnam National Museum of History. PhD in Southeast Asian Art History, Hanoi University.",
        },
        {
          name: "Tran Minh Duc",
          role: "Senior Specialist, Ceramics",
          bio: "15 years of kiln research experience across the Ly, Tran, and Le dynasties. Contributing author for Christie's and Sotheby's catalogues.",
        },
      ],
    }),
  },
  contact: {
    title: "Contact Us",
    subtitle:
      "For inquiries, private viewings, or authentication consultations — our specialists are available by appointment.",
    body: JSON.stringify({
      address: "36 Nguyen Thai Hoc Street, Hoi An Ancient Town, Quang Nam, Vietnam",
      phone: "+84 888 668 999",
      email: "contact@kimgiangantiques.com",
      hours: "Monday – Saturday: 09:00 – 18:00 (ICT)\nSunday: By appointment only",
      social: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        tiktok: "https://tiktok.com",
      },
    }),
  },
};
