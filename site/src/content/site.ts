// Site content for the Nature Touch concept demo.
// DEMO = written for the pitch, not supplied by Nature Touch. Listed in docs/BACKLOG.md
// ("Demo content to replace"). Real facts (names, services, clients, contacts) come from naturetouch.co.in.

export const DEMO = true;

export const company = {
  name: 'Nature Touch Landscape Pvt. Ltd.',
  short: 'Nature Touch',
  tagline: 'Go Green',
  address: 'B-65 Geekay Mile Stone, New Rajendra Nagar, Ring Road No.1, Raipur (C.G.)',
  phones: ['+91 999 355 0303', '(0771) 4009300', '+91 82249-19000'],
  email: 'info@naturetouch.co.in',
  whatsapp: 'https://wa.me/919993550303',
  associate: 'Rain Bird',
  clients: ['JSPL', 'NRDA', 'Wallfort', 'Avinash Group', 'Singhania'],
};

export type Project = {
  slug: string;
  name: string;
  type: string;
  place: string;
  year: string;        // DEMO
  area: string;        // DEMO
  scope: string[];     // DEMO (drawn from the real service list)
  story: string;       // DEMO
  photos: number;      // count of graded masters in src/assets/projects/<slug>/
};

export const projects: Project[] = [
  {
    slug: 'khanuj-khanna', name: 'Khanuj Khanna Residence', type: 'Farmhouse', place: 'Dharampura, Raipur',
    year: '2021', area: '1.2 acres', photos: 8,
    scope: ['Landscape design', 'Pergola and deck', 'Swimming pool', 'Palm avenue', 'Irrigation'],
    story: 'A flat field turned into a sequence of rooms: a palm avenue that walks you in, a circular lawn for family evenings, and a timber pergola over the deck that steps down from the house.',
  },
  {
    slug: 'vinay-bajaj-farm-house', name: 'Vinay Bajaj Farm House', type: 'Farmhouse', place: 'Raipur outskirts',
    year: '2021', area: '2 acres', photos: 3,
    scope: ['Master plan', 'Serpentine paths', 'Pool and lily pond', 'Lawn and palms'],
    story: 'Built from bare red earth: a serpentine brick path loops the house, a lawn opens in front of the porch, and a lily pond with a timber bridge closes the walk.',
  },
  {
    slug: 'signature-home', name: 'Signature Homes', type: 'Residential', place: 'Raipur',
    year: '2020', area: '18,000 sq ft podium', photos: 3,
    scope: ['Podium landscape', 'Pool deck', 'Geometric paving', 'Play area'],
    story: 'A podium garden drawn as one zigzag: stepping-stone paths cut through lawns and planting to two pools and a play court, all over a concrete slab.',
  },
  {
    slug: 'avinash-new-county', name: 'Avinash New County', type: 'Residential township', place: 'Raipur',
    year: '2021', area: '3.5 acres of common greens', photos: 7,
    scope: ['Rooftop and podium lawns', 'Topiary', 'Play area', 'Pool surround'],
    story: 'Shared greens for a township: clipped topiary, stepping-stone lawns, a play garden and planting that keeps the pool deck shaded.',
  },
  {
    slug: 'avinash-maruti-home', name: 'Avinash Maruti Home', type: 'Residential', place: 'Raipur',
    year: '2021', area: 'Township avenues', photos: 3,
    scope: ['Avenue planting', 'Roundabout gardens', 'Terrace planting'],
    story: 'Street trees, roundabout gardens and terrace planting that give a new township its green spine.',
  },
  {
    slug: 'romansque', name: 'Romansque', type: 'Residential', place: 'Raipur',
    year: '2020', area: '1.5 acres', photos: 4,
    scope: ['Central garden', 'Gazebos', 'Seasonal beds', 'Play court'],
    story: 'A central garden ringed by villas, with red-roofed gazebos, seasonal colour beds and a play court at its heart.',
  },
  {
    slug: 'raipur-airport', name: 'Swami Vivekananda Airport', type: 'Government', place: 'Raipur',
    year: '2019', area: 'Forecourt and approach', photos: 5,
    scope: ['Forecourt landscape', 'Fountain', 'Flower beds', 'Water feature'],
    story: 'The city\'s welcome: forecourt lawns, a fountain and flowering beds along the approach, built to stay green through Raipur summers.',
  },
  {
    slug: 'serikhedi', name: 'Serikhedi', type: 'Government', place: 'Naya Raipur',
    year: '2018', area: '6 acres', photos: 3,
    scope: ['Formal garden', 'Patterned beds', 'Radial avenues'],
    story: 'A formal garden laid out like a wheel: radial avenues of palms, patterned beds and a central fountain read from the road and the air.',
  },
  {
    slug: 'jspl-naya-raipur', name: 'JSPL', type: 'Industrial', place: 'Naya Raipur',
    year: '2019', area: 'Campus greens', photos: 7,
    scope: ['Campus landscape', 'Avenue planting', 'Lawns', 'Maintenance'],
    story: 'Campus greens for an industrial client: avenue planting, broad lawns and beds kept in shape by our maintenance teams.',
  },
];

/** DEMO: plants that drift through each case study's site walk, by project type. */
export const plantsByType: Record<string, string[]> = {
  Farmhouse: ['Foxtail palm', 'Bougainvillea', 'Frangipani', 'Mango', 'Ixora', 'Bermuda lawn', 'Areca palm', 'Hibiscus'],
  Residential: ['Areca palm', 'Ficus', 'Mondo grass', 'Duranta', 'Cycas', 'Cordyline', 'Bougainvillea', 'Golden cypress'],
  'Residential township': ['Ficus', 'Topiary box', 'Areca palm', 'Mondo grass', 'Duranta', 'Ixora', 'Bermuda lawn'],
  Government: ['Royal palm', 'Bougainvillea', 'Canna', 'Bermuda lawn', 'Ixora', 'Golden duranta', 'Neem'],
  Industrial: ['Neem', 'Gulmohar', 'Royal palm', 'Bermuda lawn', 'Ixora', 'Bougainvillea', 'Cassia'],
};

/** Full project index, as listed on naturetouch.co.in/projects (names tidied; photographed ones link to case studies). */
export const projectIndex: { name: string; type: 'Farmhouse' | 'Residential' | 'Public'; slug?: string }[] = [
  { name: 'Khanuj Khanna Residence', type: 'Farmhouse', slug: 'khanuj-khanna' },
  { name: 'Vinay Bajaj Farm House', type: 'Farmhouse', slug: 'vinay-bajaj-farm-house' },
  { name: 'Ramesh Agrawal Farm House', type: 'Farmhouse' },
  { name: 'Kalpvriksh', type: 'Farmhouse' },
  { name: 'Signature Homes', type: 'Residential', slug: 'signature-home' },
  { name: 'Avinash New County', type: 'Residential', slug: 'avinash-new-county' },
  { name: 'Avinash Maruti Home', type: 'Residential', slug: 'avinash-maruti-home' },
  { name: 'Romansque', type: 'Residential', slug: 'romansque' },
  { name: 'Wallfort Orchid', type: 'Residential' },
  { name: 'Sun City', type: 'Residential' },
  { name: 'Twin City', type: 'Residential' },
  { name: 'Swami Vivekananda Airport', type: 'Public', slug: 'raipur-airport' },
  { name: 'Serikhedi', type: 'Public', slug: 'serikhedi' },
  { name: 'JSPL', type: 'Public', slug: 'jspl-naya-raipur' },
  { name: 'Gaurav Path', type: 'Public' },
  { name: 'GMR Chowk', type: 'Public' },
  { name: 'NRDA', type: 'Public' },
  { name: 'Avinash Time Square', type: 'Public' },
];

export type Chapter = { id: string; title: string; services: { name: string; blurb: string }[] };

// Service names are exact (naturetouch.co.in/services); blurbs are DEMO.
export const chapters: Chapter[] = [
  {
    id: 'design-build', title: 'Design & build',
    services: [
      { name: 'Creative Landscape design & Development', blurb: 'Drawn by our in-house architects, built by our own teams.' },
      { name: 'Terrace garden & Rock Garden', blurb: 'Light soils, proper waterproofing and planting that suits a roof.' },
      { name: 'Interior landscape Services', blurb: 'Indoor planting and green walls for homes and offices.' },
      { name: 'Landscape renovation / enhancement & maintenance', blurb: 'We revive tired gardens and keep new ones in shape.' },
    ],
  },
  {
    id: 'water', title: 'Water',
    services: [
      { name: 'Swimming pools & spas', blurb: 'Pools designed with the garden around them, not after it.' },
      { name: 'Waterfalls Fountains, Ponds & Other Water Features', blurb: 'Rills, ponds and fountains that sound as good as they look.' },
      { name: 'Sprinkler Irrigation System', blurb: 'Automated irrigation with Rain Bird equipment.' },
      { name: 'Water management (STP Plant)', blurb: 'Treated water reused for the garden.' },
      { name: 'Rain Water harvesting', blurb: 'Monsoon water stored and returned to the ground.' },
    ],
  },
  {
    id: 'built', title: 'Built outdoors',
    services: [
      { name: 'Decks pergolas & custom outdoor structures', blurb: 'Timber decks, pergolas and gazebos made for the site.' },
      { name: 'Patios Walkways & paving', blurb: 'Stone, brick and stepping-stone paths that age well.' },
    ],
  },
  {
    id: 'light', title: 'Light',
    services: [
      { name: 'Electrical & Landscape lighting', blurb: 'Uplights, path lights and warm pergola light for evenings outdoors.' },
    ],
  },
];

export const about = {
  // DEMO
  lede: 'We are landscape designers and builders from Raipur. Our architects draw the garden, our teams build it, and our own nursery grows the plants that go into it.',
  steps: [
    { title: 'Visit the site', text: 'We walk the plot, test the soil and look at sun, wind and water.' },
    { title: 'Draw the plan', text: 'Our architects prepare a plan with paths, lawns, water and planting.' },
    { title: 'Build it', text: 'Our teams handle earthwork, paving, water features, lighting and planting.' },
    { title: 'Look after it', text: 'Maintenance visits keep the garden growing the way it was drawn.' },
  ],
};

/** Plants photographed at the nursery (cut-outs in src/assets/plants/). Groups follow naturetouch.co.in. */
export const nurseryPlants = [
  { n: 'coleus', name: 'Coleus', latin: 'Coleus scutellarioides', group: 'Ornamental' },
  { n: 'begonia', name: 'Begonia', latin: 'Begonia semperflorens', group: 'Ornamental' },
  { n: 'cordyline', name: 'Cordyline', latin: 'Cordyline fruticosa', group: 'Ornamental' },
  { n: 'echeveria', name: 'Agave', latin: 'Agave potatorum', group: 'Decorative' },
  { n: 'anthurium', name: 'Anthurium', latin: 'Anthurium andraeanum', group: 'Decorative' },
  { n: 'rubber-plant', name: 'Rubber plant', latin: 'Ficus elastica', group: 'Indoor-Outdoor' },
  { n: 'dracaena', name: 'Song of India', latin: 'Dracaena reflexa', group: 'Indoor-Outdoor' },
  { n: 'ficus', name: 'Ficus Audrey', latin: 'Ficus benghalensis', group: 'Indoor-Outdoor' },
  { n: 'areca-palm', name: 'Areca palm', latin: 'Dypsis lutescens', group: 'Palms' },
  { n: 'sago-palm', name: 'Sago palm', latin: 'Cycas revoluta', group: 'Palms' },
];

export const nursery = {
  name: 'Nature Care',
  // Plant groups as named on naturetouch.co.in
  groups: ['Ornamental', 'Decorative', 'Indoor-Outdoor', 'Avenue', 'Fruits', 'Palms'],
  // DEMO: one line per group, and the unphotographed groups as names
  notes: {
    Ornamental: 'Colour and pattern for beds, borders and seasonal displays.',
    Decorative: 'Sculptural plants for pots, courtyards and rockeries.',
    'Indoor-Outdoor': 'Hardy foliage that is as happy on a verandah as in a living room.',
    Palms: 'Grown on to size for avenues, pool edges and courtyards.',
    Avenue: 'Neem, Gulmohar, Kadam, Cassia and Royal palm, grown to transplant size.',
    Fruits: 'Mango, guava, lemon, chikoo and pomegranate, grafted for farmhouse orchards.',
  } as Record<string, string>,
};
