export const CATEGORIES = [
  { id: 'all', name: 'All Tees', count: 10, desc: 'Complete LUNAR T-Shirt Collection' },
  { id: 'oversized', name: 'Oversized & Boxy', count: 4, desc: 'Heavyweight Drop-Shoulder Silhouettes' },
  { id: 'graphic', name: 'Graphic & Cyberpunk', count: 3, desc: 'High-Density Screenprinted Artwork' },
  { id: 'vintage', name: 'Acid Wash & Vintage', count: 2, desc: 'Sun-Faded Distressed Mineral Washes' },
  { id: 'minimal', name: 'Minimal Heavyweight', count: 3, desc: '360 GSM Luxury Blank Essentials' },
  { id: 'limited', name: 'Limited Drops', count: 2, desc: 'Numbered 1-of-150 Batch Pieces' },
];

export const GSM_WEIGHTS = [
  { id: 'all', name: 'All Weights' },
  { id: '280', name: '280 GSM Mid-Heavy' },
  { id: '300', name: '300 GSM Heavyweight' },
  { id: '340', name: '340+ GSM Ultra-Heavy' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCTS = [
  {
    id: 'lunar-tee-01',
    name: 'Cyber Astral Oversized Graphic Tee',
    tagline: '320 GSM Heavyweight Combed Cotton • Drop-Shoulder',
    price: 68,
    originalPrice: 85,
    category: 'graphic',
    fit: 'Oversized Boxy',
    gsm: 320,
    rating: 4.9,
    reviewsCount: 84,
    isNew: true,
    isLimited: false,
    badge: 'HOT DROP',
    stock: 12,
    images: [
      // Front View
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      // Back / Lifestyle View
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      // Detail View
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0B0C10', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Vintage Washed Grey', hex: '#475569', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Starlight Off-White', hex: '#F1F5F9', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Constructed from custom 320 GSM high-density combed cotton with an ultra-soft peached handfeel. Features high-definition cybernetic lunar coordinate graphics on both chest and full back with anti-cracking plastisol ink.',
    specs: {
      fabric: '100% Organic Combed Long-Staple Cotton',
      weight: '320 GSM Heavyweight Jersey',
      collar: '3.2cm High-Rib Seamless Neck (Zero Sag Guarantee)',
      finish: 'Pre-shrunk enzyme wash with silicone finish',
      fitType: 'Exaggerated Drop-Shoulder Oversized Silhouette',
      origin: 'Milled & Crafted in Portugal'
    },
    details: [
      '320 GSM single-jersey combed Portuguese cotton',
      'High-density plastisol screenprint on chest and back',
      '3.2cm tight crew collar with reinforced double-needle binding',
      'Pre-shrunk fabric ensuring zero wash shrinkage',
      'Signature tonal embroidered Lunar orbit insignia on left sleeve'
    ],
    modelInfo: 'Model is 6\'1" (185cm), 76kg wearing Size Large for an oversized streetwear drape.'
  },
  {
    id: 'lunar-tee-02',
    name: 'Void Architecture Boxy Heavy Tee',
    tagline: '340 GSM Ultra-Heavy Loopback Cotton • Minimalist',
    price: 74,
    originalPrice: null,
    category: 'minimal',
    fit: 'Boxy Relaxed',
    gsm: 340,
    rating: 5.0,
    reviewsCount: 112,
    isNew: true,
    isLimited: false,
    badge: 'BESTSELLER',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Pitch Obsidian', hex: '#0D0E12', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Alabaster Chalk', hex: '#F8FAFC', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Basalt Slate', hex: '#334155', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'The definitive architectural blank tee. Ultra-dense 340 GSM cotton creates a crisp structured silhouette that holds its boxy form throughout the day without clinging to the body.',
    specs: {
      fabric: '100% Heavy Combed Ring-Spun Cotton',
      weight: '340 GSM Ultra-Heavy Jersey',
      collar: '3.5cm Heavyweight 1x1 Rib Collar',
      finish: 'Carbon-brushed velvet handfeel',
      fitType: 'Boxy streetwear cut with wide chest and cropped body',
      origin: 'Milled in Kyoto, Japan'
    },
    details: [
      '340 GSM luxury Japanese combed cotton',
      'Structured boxy profile that does not crease easily',
      'Thick 3.5cm ribbed neckline designed to stay flush against the neck',
      'Blind hem stitch on sleeves and bottom for a razor-clean look',
      'Blind tonal embossed logo on lower left hip'
    ],
    modelInfo: 'Model is 5\'11" (180cm), 72kg wearing Size Medium for a clean boxy fit.'
  },
  {
    id: 'lunar-tee-03',
    name: 'Acid Supermoon Vintage Distressed Tee',
    tagline: '290 GSM Mineral Washed • Sun-Faded Retro Patina',
    price: 72,
    originalPrice: 90,
    category: 'vintage',
    fit: 'Oversized Fit',
    gsm: 290,
    rating: 4.8,
    reviewsCount: 67,
    isNew: false,
    isLimited: false,
    badge: 'ACID WASH',
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Acid Mineral Charcoal', hex: '#262930', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Sun-Faded Vintage Slate', hex: '#4B5563', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Each piece undergoes a rigorous 4-stage artisanal stone and mineral acid wash, resulting in a 1-of-1 vintage faded patina with micro-distressed hems and a lived-in drape.',
    specs: {
      fabric: '100% Washed Vintage Ring-Spun Cotton',
      weight: '290 GSM Mid-Heavy Washed Jersey',
      collar: 'Slightly distressed vintage crewneck',
      finish: 'Individual enzyme stone acid wash treatment',
      fitType: 'Relaxed vintage drape with dropped armholes',
      origin: 'Finished in Los Angeles, USA'
    },
    details: [
      '290 GSM soft-washed ring-spun cotton',
      'Unique wash pattern on every single tee (no two are identical)',
      'Cracked-vintage screenprint texture for authentic 90s aesthetic',
      'Subtly distressed collar and cuff ribbing',
      'Super-soft handfeel from multi-stage garment tumbling'
    ],
    modelInfo: 'Model is 6\'2" (188cm) wearing Size Large.'
  },
  {
    id: 'lunar-tee-04',
    name: 'Neo-Tokyo Kanji Backprint Oversized Tee',
    tagline: '300 GSM Heavyweight • High-Density Cyber Screenprint',
    price: 69,
    originalPrice: 82,
    category: 'graphic',
    fit: 'Oversized Boxy',
    gsm: 300,
    rating: 4.9,
    reviewsCount: 95,
    isNew: true,
    isLimited: false,
    badge: 'GRAPHIC DROP',
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Oatmeal Bone', hex: '#E2DCD5', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Stealth Black', hex: '#111217', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Showcasing a cyberpunk Tokyo lunar observatory blueprint screenprinted across the full back in high-density reflective ink. Minimalist Japanese typography on front left chest.',
    specs: {
      fabric: '100% Combed Compact Cotton',
      weight: '300 GSM Heavyweight',
      collar: '3cm Rib Collar with neck tape',
      finish: 'Silicone anti-pilling wash',
      fitType: 'Oversized Streetwear Silhouette',
      origin: 'Crafted in South Korea'
    },
    details: [
      '300 GSM ultra-clean combed cotton jersey',
      'Multi-color silk screenprint with 3M reflective accents',
      'Wide drop shoulders with elongated sleeves',
      'Side split hem for effortless layering over hoodies or undershirts',
      'Reinforced shoulder-to-shoulder herringbone tape'
    ],
    modelInfo: 'Model is 5\'10" (178cm) wearing Size Medium.'
  },
  {
    id: 'lunar-tee-05',
    name: 'Monolith 360 GSM Ultra-Heavy Blank Tee',
    tagline: '360 GSM Pure Luxury Interlock • The Ultimate Heavyweight',
    price: 78,
    originalPrice: null,
    category: 'minimal',
    fit: 'Boxy Heavyweight',
    gsm: 360,
    rating: 5.0,
    reviewsCount: 142,
    isNew: false,
    isLimited: false,
    badge: '360 GSM HEAVY',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Pure Chalk White', hex: '#FFFFFF', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Void Obsidian', hex: '#0B0C10', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Earthy Sand', hex: '#D4C5B9', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Engineered for those who demand maximum density. At 360 GSM, this is our heaviest t-shirt ever created—offering a completely opaque, sculpted silhouette that feels like wearable armor.',
    specs: {
      fabric: '100% Organic Double-Knit Cotton Interlock',
      weight: '360 GSM Armor-Grade Heavyweight',
      collar: '3.5cm Chunky Tubular Collar',
      finish: 'Peached organic biowash',
      fitType: 'Structured Boxy Cut',
      origin: 'Milled in Milan, Italy'
    },
    details: [
      '360 GSM heavyweight double-knit interlock cotton',
      'Completely opaque fabric (zero transparency in white)',
      'Substantial drape that holds shape in all climates',
      'Pre-shrunk to less than 1% variance',
      'Custom woven lunar hem label in gold thread'
    ],
    modelInfo: 'Model is 6\'0" (183cm), 80kg wearing Size Large.'
  },
  {
    id: 'lunar-tee-06',
    name: 'Solar Eclipse Holographic Limited Tee',
    tagline: '310 GSM Combed Cotton • Foil Transfer Print',
    price: 88,
    originalPrice: 110,
    category: 'limited',
    fit: 'Oversized Boxy',
    gsm: 310,
    rating: 5.0,
    reviewsCount: 38,
    isNew: true,
    isLimited: true,
    badge: 'LIMITED 150 PCS',
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Eclipse Chrome Black', hex: '#0B0C10', image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Limited edition serialized release (strictly 150 units worldwide). Features an iridescent holographic solar corona graphic that shifts colors between gold, cyan, and violet under direct lighting.',
    specs: {
      fabric: '100% Mercerized Combed Long-Staple Cotton',
      weight: '310 GSM Luxury Mercerized Jersey',
      collar: '3.2cm Seamless Ribbed Collar',
      finish: 'Lustrous mercerization with liquid-soft drape',
      fitType: 'Oversized Runway Fit',
      origin: 'Numbered Atelier Production'
    },
    details: [
      '310 GSM mercerized cotton with cool-touch silk-like softness',
      'Individually laser-engraved serialized titanium badge on hem (e.g. 042/150)',
      'Prismatic holographic transfer artwork on chest and spinal axis',
      'Includes custom metallic matte collector box and authenticity card',
      'One-time drop — strictly will never be restocked'
    ],
    modelInfo: 'Model is 6\'1" (186cm) wearing Size Large.'
  },
  {
    id: 'lunar-tee-07',
    name: 'Raw-Hem Distressed Streetwear Tee',
    tagline: '300 GSM Heavy Cotton • Raw Edge Sleeves & Hem',
    price: 66,
    originalPrice: 78,
    category: 'oversized',
    fit: 'Oversized Boxy',
    gsm: 300,
    rating: 4.7,
    reviewsCount: 52,
    isNew: false,
    isLimited: false,
    badge: 'RAW FINISH',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Washed Olive Sage', hex: '#4A5340', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Faded Earth Clay', hex: '#634832', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Charcoal Black', hex: '#1E2026', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Designed for a deconstructed brutalist aesthetic. Features unhemmed raw edges on the sleeves and bottom hem that naturally curl into a subtle micro-roll after the first wash.',
    specs: {
      fabric: '100% Combed Heavy Cotton',
      weight: '300 GSM Heavyweight Jersey',
      collar: 'Tight 3cm Rib Crew Collar with double stitch',
      finish: 'Garment washed for softness',
      fitType: 'Dropped Shoulder Relaxed Drape',
      origin: 'Crafted in Istanbul, Turkey'
    },
    details: [
      '300 GSM combed cotton with raw-cut sleeve and waist hems',
      'Reinforced side stay stitches prevent excessive fraying past 3mm',
      'Slightly widened neckline for effortless drape',
      'Garment enzyme washed to prevent any post-purchase shrinkage',
      'Micro-tonal Lunar branding across center chest'
    ],
    modelInfo: 'Model is 5\'11" (180cm) wearing Size Medium.'
  },
  {
    id: 'lunar-tee-08',
    name: 'Celestial Orbit Backprint Heavy Tee',
    tagline: '320 GSM French Terry Cotton • Cosmic Typography',
    price: 70,
    originalPrice: 85,
    category: 'graphic',
    fit: 'Oversized Boxy',
    gsm: 320,
    rating: 4.9,
    reviewsCount: 79,
    isNew: false,
    isLimited: false,
    badge: 'COMMUNITY FAVORITE',
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Cosmic Cobalt Blue', hex: '#1E3A8A', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Obsidian Black', hex: '#0B0C10', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Embossed puff-print celestial charts across the back shoulder span with ultra-sharp coordinates and astrological typography. Clean minimalist chest typography.',
    specs: {
      fabric: '100% Lightweight Micro French Terry Cotton',
      weight: '320 GSM Looped Back Jersey',
      collar: '3.2cm 2x2 Tight Heavy Rib',
      finish: 'Anti-shrink stone wash',
      fitType: 'Wide Boxy Silhouette',
      origin: 'Crafted in Portugal'
    },
    details: [
      '320 GSM micro loopback French terry jersey',
      'Tactile 3D puff-print lettering on reverse',
      'Ultra-breathable textured interior loop fabric',
      'Heavy ribbed collar that retains tension wash after wash',
      'Dropped shoulder seam with reinforced topstitching'
    ],
    modelInfo: 'Model is 6\'1" (185cm) wearing Size Large.'
  },
  {
    id: 'lunar-tee-09',
    name: 'Faded Pastel Mineral Acid Tee',
    tagline: '280 GSM Sun-Drenched Cotton • Soft Pastels',
    price: 65,
    originalPrice: null,
    category: 'vintage',
    fit: 'Relaxed Fit',
    gsm: 280,
    rating: 4.8,
    reviewsCount: 43,
    isNew: true,
    isLimited: false,
    badge: 'SUMMER WASH',
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Mineral Lilac Mist', hex: '#9488A0', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Faded Matcha Sage', hex: '#6A7D6D', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'An airy 280 GSM relaxed tee dyed with organic botanical pigments and finished with a mild acid wash, creating subtle dusty hues and supreme breathability.',
    specs: {
      fabric: '100% Organic Combed Ring-Spun Cotton',
      weight: '280 GSM Mid-Weight Washed Jersey',
      collar: '2.8cm Soft Ribbed Neck',
      finish: 'Eco-certified botanical garment dye',
      fitType: 'Fluid Relaxed Cut',
      origin: 'Crafted in Spain'
    },
    details: [
      '280 GSM feather-soft combed cotton',
      'Garment dyed using non-toxic earth pigments',
      'Featherlight drape that is ideal for warm seasons or layering',
      'Pre-washed to give an immediate broken-in softness',
      'Subtle monochrome embroidered moon icon on chest'
    ],
    modelInfo: 'Model is 5\'9" (175cm) wearing Size Small.'
  },
  {
    id: 'lunar-tee-10',
    name: 'Phantom Void Boxy Minimalist Tee',
    tagline: '330 GSM Mercerized Combed Cotton • Drop Shoulder',
    price: 70,
    originalPrice: 85,
    category: 'oversized',
    fit: 'Oversized Boxy',
    gsm: 330,
    rating: 4.9,
    reviewsCount: 88,
    isNew: false,
    isLimited: false,
    badge: 'ESSENTIAL FIT',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Carbon Basalt', hex: '#1C1D24', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Off-White Starlight', hex: '#F1F5F9', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'The archetype of streetwear silhouette. Designed with a wide chest circumference, wide half-length sleeves, and high-density 330 GSM weave that never clings.',
    specs: {
      fabric: '100% Combed Ring-Spun Cotton',
      weight: '330 GSM Heavyweight Jersey',
      collar: '3.2cm Heavy Rib Crew Collar',
      finish: 'Bio-polished silk finish',
      fitType: 'Oversized Boxy Streetwear Cut',
      origin: 'Crafted in Portugal'
    },
    details: [
      '330 GSM ultra-dense combed cotton',
      'Oversized boxy streetwear drape with dropped shoulder seams',
      'Thick neckline collar that never curls or stretches out',
      'Pre-shrunk and color-locked for permanent vibrancy',
      'Signature minimalist Lunar studio label'
    ],
    modelInfo: 'Model is 6\'1" (185cm) wearing Size Large.'
  }
];

export const TEE_BUNDLES = [
  {
    id: 'bundle-1',
    name: 'Dual Essential Duo (2-Tee Pack)',
    desc: 'Pick any Graphic Tee + Minimal Heavyweight Blank and save 15%',
    tee1Id: 'lunar-tee-01',
    tee2Id: 'lunar-tee-02',
    discountPercent: 15,
    tag: 'Popular Bundle'
  },
  {
    id: 'bundle-2',
    name: 'Heavyweight Collector 3-Pack',
    desc: '300+ GSM Heavyweight Boxy rotation with 20% savings + Free Express Delivery',
    tee1Id: 'lunar-tee-05',
    tee2Id: 'lunar-tee-04',
    tee3Id: 'lunar-tee-03',
    discountPercent: 20,
    tag: 'Best Value'
  }
];

export const REVIEWS = [
  {
    id: 1,
    author: 'Marcus K.',
    city: 'Los Angeles, USA',
    item: 'Cyber Astral Oversized Graphic Tee',
    rating: 5,
    verified: true,
    date: '2 days ago',
    comment: 'Best 320 GSM tee I have ever touched. The collar is nice and tight so it doesn’t sag or bacon-neck after washing, and the boxy drop-shoulder cut falls perfectly over denim or cargos.',
  },
  {
    id: 2,
    author: 'Elena R.',
    city: 'Tokyo, JP',
    item: 'Void Architecture Boxy Heavy Tee',
    rating: 5,
    verified: true,
    date: '5 days ago',
    comment: 'The 340 GSM weight has this structured, sculptural drape that keeps its shape all day. Zero transparency in the white colorway. Pure luxury quality!',
  },
  {
    id: 3,
    author: 'Alexander V.',
    city: 'Berlin, DE',
    item: 'Acid Supermoon Vintage Distressed Tee',
    rating: 5,
    verified: true,
    date: '1 week ago',
    comment: 'The mineral wash is incredible in person—looks like an authentic 90s band tour tee with modern luxury cotton softness. Ordered 2 more colors immediately.',
  },
  {
    id: 4,
    author: 'Liam T.',
    city: 'London, UK',
    item: 'Monolith 360 GSM Ultra-Heavy Blank Tee',
    rating: 5,
    verified: true,
    date: '2 weeks ago',
    comment: 'Heavyweight t-shirt perfection. The 360 GSM double-knit feels substantial and premium. It’s thick without being stiff, and the collar stays flush against the neck.',
  },
];

export const BRAND_VALUES = [
  {
    icon: 'Layers',
    title: '280 – 360 GSM Heavyweight',
    desc: 'Ultra-dense combed ring-spun cotton that holds a crisp structured streetwear drape.'
  },
  {
    icon: 'ShieldCheck',
    title: 'Zero-Sag Collar Guarantee',
    desc: 'Reinforced 3.2cm high-rib tight necklines with double-needle stitch that never bacon-neck.'
  },
  {
    icon: 'Sparkles',
    title: 'Pre-Shrunk & Colorfast',
    desc: 'Enzyme bio-washed to eliminate post-wash shrinkage and preserve rich saturated color.'
  },
  {
    icon: 'Truck',
    title: 'Fast Global Delivery',
    desc: 'Free worldwide express shipping on all orders over $75 with easy 30-day exchanges.'
  }
];
