export type Gender = "men" | "women" | "unisex";
export type Strap = "leather" | "steel" | "mesh" | "bracelet";
export type Collection = "studio" | "atelier";

export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  gender: Gender;
  strap: Strap;
  collection: Collection;
  featured?: boolean;
  newLaunch?: boolean;
  category: string;
  image: string;
  gallery: string[];
  blurb: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "chronographs",
    name: "Chronographs",
    price: 6500,
    gender: "men",
    strap: "leather",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Leather Watches",
    image: "/images/chrono-brown.jpg",
    gallery: ["/images/chrono-brown.jpg"],
    blurb: "Rose-gold quiet, cognac leather, a three-hand classic.",
    description:
      "A clean three-hand dress watch in rose gold with a white dial and a cognac leather strap. Built for daily wear — slim enough for a cuff, warm enough for evening. Swiss Eagle movement, sapphire crystal, and a deployant that disappears under the wrist.",
    specs: [
      { label: "Case", value: "38 mm rose-gold PVD, 9.2 mm thin" },
      { label: "Crystal", value: "Sapphire, anti-reflective" },
      { label: "Movement", value: "Swiss Eagle cal. SE-21 quartz" },
      { label: "Water", value: "50 m" },
      { label: "Strap", value: "Cognac calf leather, 20 mm" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "aviator-watches",
    name: "Aviator Watches",
    price: 16000,
    gender: "women",
    strap: "bracelet",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Steel Bracelet Watches",
    image: "/images/aviator-rose.jpg",
    gallery: ["/images/aviator-rose.jpg"],
    blurb: "Mother-of-pearl, a diamond halo, rose-gold links.",
    description:
      "A jewellery watch with a mother-of-pearl dial, roman indices, and a pavé bezel set in polished rose gold. The three-link bracelet sits close to the wrist — light, articulate, made to catch candlelight rather than a spotlight.",
    specs: [
      { label: "Case", value: "32 mm rose-gold PVD" },
      { label: "Bezel", value: "Pavé crystal halo" },
      { label: "Crystal", value: "Sapphire" },
      { label: "Movement", value: "Swiss Eagle cal. SE-12 quartz" },
      { label: "Water", value: "30 m" },
      { label: "Bracelet", value: "Polished rose-gold three-link" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "onlyou-3rd-edition",
    name: "ONLYOU 3rd edition",
    price: 11000,
    gender: "men",
    strap: "steel",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Steel Bracelet Watches",
    image: "/images/onlyou-black.jpg",
    gallery: ["/images/onlyou-black.jpg"],
    blurb: "Black steel chronograph, three registers, third edition.",
    description:
      "The third edition of ONLYOU: a black sunburst chronograph on a five-link steel bracelet. Three silver-rimmed registers, a date at four, and a case that reads like instrument rather than ornament. Limited to this run.",
    specs: [
      { label: "Case", value: "42 mm black PVD steel" },
      { label: "Crystal", value: "Sapphire, anti-reflective" },
      { label: "Movement", value: "Swiss Eagle cal. SE-chrono" },
      { label: "Water", value: "100 m" },
      { label: "Bracelet", value: "Black PVD five-link, 22 mm" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "sunmate-green-edition",
    name: "SunMate Green Edition",
    price: 24000,
    gender: "women",
    strap: "leather",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Leather Watches",
    image: "/images/sunmate-green.jpg",
    gallery: ["/images/sunmate-green.jpg"],
    blurb: "Forest-green dial, diamond bezel, hunter leather.",
    description:
      "SunMate in its green edition — a forest sunburst dial set in rose gold, framed by a pavé bezel and a hunter-green leather strap. The leaf hands are a quiet signature. Evenings, dinners, the watch you reach for when the rest of the jewellery stays in the box.",
    specs: [
      { label: "Case", value: "34 mm rose-gold PVD" },
      { label: "Bezel", value: "Pavé crystal" },
      { label: "Crystal", value: "Sapphire" },
      { label: "Movement", value: "Swiss Eagle cal. SE-12 quartz" },
      { label: "Water", value: "30 m" },
      { label: "Strap", value: "Hunter-green calf, 16 mm" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "hexa-or",
    name: "Hexa Or",
    price: 34500,
    gender: "women",
    strap: "bracelet",
    collection: "atelier",
    newLaunch: true,
    category: "Women's Watches",
    image: "/images/cat-women.jpg",
    gallery: ["/images/cat-women.jpg"],
    blurb: "Tonneau gold, roman cream, a bracelet that reads couture.",
    description:
      "A hexagonal tonneau in polished gold-tone with a cream roman dial and dauphine hands. The bracelet is integrated — no lugs, no apology. An atelier piece from the women's collection, photographed as worn in low light.",
    specs: [
      { label: "Case", value: "34 × 38 mm gold-tone tonneau" },
      { label: "Crystal", value: "Sapphire" },
      { label: "Movement", value: "Swiss Eagle cal. SE-18" },
      { label: "Water", value: "30 m" },
      { label: "Bracelet", value: "Integrated gold-tone" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "steel-bracelet-chrono",
    name: "Steel Bracelet Chrono",
    price: 18900,
    gender: "men",
    strap: "steel",
    collection: "atelier",
    newLaunch: true,
    category: "Steel Bracelet Watches",
    image: "/images/cat-steel.jpg",
    gallery: ["/images/cat-steel.jpg"],
    blurb: "Panda cream, steel, a red-tipped second.",
    description:
      "A vintage-leaning steel chronograph with a cream panda dial, dark registers, and a red-tipped seconds hand. The bracelet is brushed and polished in alternate links. Made for the wrist that already owns a dress watch and wants an instrument.",
    specs: [
      { label: "Case", value: "40 mm stainless steel" },
      { label: "Crystal", value: "Sapphire, boxed" },
      { label: "Movement", value: "Swiss Eagle cal. SE-chrono" },
      { label: "Water", value: "100 m" },
      { label: "Bracelet", value: "Steel three-link, 20 mm" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "carre-cuir",
    name: "Carré Cuir",
    price: 12500,
    gender: "women",
    strap: "leather",
    collection: "atelier",
    newLaunch: true,
    category: "Leather Watches",
    image: "/images/cat-leather.jpg",
    gallery: ["/images/cat-leather.jpg"],
    blurb: "A small gold rectangle on cognac leather.",
    description:
      "A compact rectangular gold-tone case, cream dial, and cognac leather strap. Carré Cuir is the smallest watch in the atelier — a tank silhouette without the costume. Meant to sit just above the wrist bone.",
    specs: [
      { label: "Case", value: "24 × 32 mm gold-tone" },
      { label: "Crystal", value: "Sapphire" },
      { label: "Movement", value: "Swiss Eagle cal. SE-8 quartz" },
      { label: "Water", value: "30 m" },
      { label: "Strap", value: "Cognac leather, 14 mm" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "open-heart",
    name: "Open Heart",
    price: 27500,
    gender: "men",
    strap: "leather",
    collection: "atelier",
    newLaunch: true,
    category: "Men's Watches",
    image: "/images/cat-men.jpg",
    gallery: ["/images/cat-men.jpg"],
    blurb: "Skeleton cream, visible gears, brown leather.",
    description:
      "An open-worked cream dial that shows the going train, large arabic numerals, and a steel case on brown leather. Mechanical, exhibition, and deliberately un-quiet. The men's atelier piece.",
    specs: [
      { label: "Case", value: "42 mm stainless steel" },
      { label: "Crystal", value: "Sapphire front, exhibition caseback" },
      { label: "Movement", value: "Swiss Eagle cal. SE-skel automatic" },
      { label: "Water", value: "50 m" },
      { label: "Strap", value: "Brown calf, 22 mm" },
      { label: "Warranty", value: "2 years" },
    ],
  },
];

export const categories = [
  {
    slug: "women",
    name: "Women's Watches",
    image: "/images/cat-women.jpg",
    href: "/shop?gender=women",
    span: "tall" as const,
  },
  {
    slug: "steel",
    name: "Steel Bracelet Watches",
    image: "/images/cat-steel.jpg",
    href: "/shop?strap=steel",
    span: "top" as const,
  },
  {
    slug: "leather",
    name: "Leather Watches",
    image: "/images/cat-leather.jpg",
    href: "/shop?strap=leather",
    span: "bottom" as const,
  },
  {
    slug: "men",
    name: "Men's Watches",
    image: "/images/cat-men.jpg",
    href: "/shop?gender=men",
    span: "tall" as const,
  },
];

export const looks = [
  {
    src: "/images/life-woman.jpg",
    alt: "Gold bracelet watch on a ribbed knit",
    href: "/product/aviator-watches",
  },
  {
    src: "/images/life-wrist.jpg",
    alt: "Two-tone dress watch on the wrist",
    href: "/product/hexa-or",
  },
  {
    src: "/images/life-man.jpg",
    alt: "Dark-dial watch with a camel polo",
    href: "/product/onlyou-3rd-edition",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function featuredProducts() {
  return products.filter((p) => p.featured);
}

export function newLaunches() {
  return products.filter((p) => p.newLaunch);
}

export function relatedProducts(slug: string, n = 4) {
  const current = getProduct(slug);
  if (!current) return products.slice(0, n);
  const rest = products.filter((p) => p.slug !== slug);
  const same = rest.filter(
    (p) => p.gender === current.gender || p.strap === current.strap,
  );
  const merged = [...same, ...rest.filter((p) => !same.includes(p))];
  return merged.slice(0, n);
}
