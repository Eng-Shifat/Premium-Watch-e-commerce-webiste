export type Gender = "men" | "women" | "unisex";
export type Strap = "leather" | "steel" | "mesh" | "bracelet";
export type Collection = "studio" | "atelier";

export type Product = {
  slug: string;
  name: string;
  /** shown in the Shop sidebar "Brand" filter — edit freely */
  brand: string;
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
    brand: "Swiss Eagle",
    price: 6500,
    compareAt: 6500,
    gender: "men",
    strap: "leather",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Leather Watches",
    image: "/images/featured products/Chronographs.png",
    gallery: ["/images/featured products/Chronographs.png"],
    blurb: "Rose-gold quiet, cognac leather, a three-hand classic.",
    description: "A clean three-hand dress watch in rose gold with a white dial and a cognac leather strap.",
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
    brand: "SunMate",
    price: 16000,
    compareAt: 16000,
    gender: "women",
    strap: "bracelet",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Steel Bracelet Watches",
    image: "/images/featured products/Aviator Watches.png",
    gallery: ["/images/featured products/Aviator Watches.png"],
    blurb: "Mother-of-pearl, a diamond halo, rose-gold links.",
    description: "A jewellery watch with a mother-of-pearl dial, roman indices, and a pavé bezel set in polished rose gold.",
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
    brand: "OnlYou",
    price: 11000,
    compareAt: 11000,
    gender: "men",
    strap: "steel",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Steel Bracelet Watches",
    image: "/images/featured products/ONLYOU 3rd edition.png",
    gallery: ["/images/featured products/ONLYOU 3rd edition.png"],
    blurb: "Black steel chronograph, three registers, third edition.",
    description: "The third edition of ONLYOU: a black sunburst chronograph on a five-link steel bracelet.",
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
    brand: "SunMate",
    price: 24000,
    compareAt: 24000,
    gender: "women",
    strap: "leather",
    collection: "studio",
    featured: true,
    newLaunch: true,
    category: "Leather Watches",
    image: "/images/featured products/SunMate Green Edition.png",
    gallery: ["/images/featured products/SunMate Green Edition.png"],
    blurb: "Forest-green dial, diamond bezel, hunter leather.",
    description: "SunMate in its green edition — a forest sunburst dial set in rose gold, framed by a pavé bezel.",
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
    slug: "chronographs-nl",
    name: "Chronographs",
    brand: "Swiss Eagle",
    price: 6500,
    compareAt: 6500,
    gender: "men",
    strap: "leather",
    collection: "atelier",
    newLaunch: true,
    category: "Leather Watches",
    image: "/images/new launches/Chronographs.png",
    gallery: ["/images/new launches/Chronographs.png"],
    blurb: "Rose-gold quiet, cognac leather, a three-hand classic.",
    description: "A clean three-hand dress watch in rose gold.",
    specs: [
      { label: "Case", value: "38 mm rose-gold PVD" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "aviator-watches-nl",
    name: "Aviator Watches",
    brand: "SunMate",
    price: 16000,
    compareAt: 16000,
    gender: "women",
    strap: "bracelet",
    collection: "atelier",
    newLaunch: true,
    category: "Steel Bracelet Watches",
    image: "/images/new launches/Aviator Watches.png",
    gallery: ["/images/new launches/Aviator Watches.png"],
    blurb: "Mother-of-pearl, a diamond halo, rose-gold links.",
    description: "A jewellery watch with a mother-of-pearl dial.",
    specs: [
      { label: "Case", value: "32 mm rose-gold PVD" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "onlyou-3rd-edition-nl",
    name: "ONLYOU 3rd edition",
    brand: "OnlYou",
    price: 11000,
    compareAt: 11000,
    gender: "men",
    strap: "steel",
    collection: "atelier",
    newLaunch: true,
    category: "Steel Bracelet Watches",
    image: "/images/new launches/ONLYOU 3rd edition.png",
    gallery: ["/images/new launches/ONLYOU 3rd edition.png"],
    blurb: "Black steel chronograph, three registers.",
    description: "The third edition of ONLYOU.",
    specs: [
      { label: "Case", value: "42 mm black PVD steel" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "sunmate-green-edition-nl",
    name: "SunMate Green Edition",
    brand: "SunMate",
    price: 24000,
    compareAt: 24000,
    gender: "women",
    strap: "leather",
    collection: "atelier",
    newLaunch: true,
    category: "Leather Watches",
    image: "/images/new launches/SunMate Green Edition.png",
    gallery: ["/images/new launches/SunMate Green Edition.png"],
    blurb: "Forest-green dial, diamond bezel.",
    description: "SunMate green edition.",
    specs: [
      { label: "Case", value: "34 mm rose-gold PVD" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "fossil-flynn-chronograph",
    name: "FOSSIL Flynn Chronograph Smoke Stainless Steel Watch",
    brand: "FOSSIL",
    price: 8650,
    compareAt: 14500,
    gender: "men",
    strap: "steel",
    collection: "fossil",
    featured: false,
    newLaunch: true,
    category: "Chronograph Watches",
    image: "/product/fossil main.png",
    gallery: [
      "/product/fossil main.png",
      "/product/fossil side.png",
      "/product/fossil top.png",
    ],
    blurb: "Smoke stainless steel chronograph with bold blue dial.",
    description: "FOSSIL Flynn Chronograph with smoke-tone stainless steel case and bracelet, blue multi-function dial.",
    specs: [
      { label: "For", value: "Men" },
      { label: "Brand", value: "FOSSIL" },
      { label: "Color", value: "Silver" },
      { label: "Crystal", value: "Mineral" },
      { label: "Movement", value: "Quartz chronograph" },
    ],
  },
];

export const categories = [
  {
    slug: "women",
    name: "Women's Watches",
    image: "/images/view our ranges of catagories/Women\u2019s Watches.png",
    href: "/shop?gender=women",
    span: "tall" as const,
  },
  {
    slug: "steel",
    name: "Steel Bracelet Watches",
    image: "/images/view our ranges of catagories/Steel Bracelet Watches.png",
    href: "/shop?strap=steel",
    span: "top" as const,
  },
  {
    slug: "leather",
    name: "Leather Watches",
    image: "/images/view our ranges of catagories/leather.png",
    href: "/shop?strap=leather",
    span: "bottom" as const,
  },
  {
    slug: "men",
    name: "Men's Watches",
    image: "/images/view our ranges of catagories/Mens' watches.png",
    href: "/shop?gender=men",
    span: "tall" as const,
  },
];

export const looks = [
  {
    src: "/images/hand picked/left.png",
    alt: "Hand picked watch look left",
    href: "/product/aviator-watches",
  },
  {
    src: "/images/hand picked/center.png",
    alt: "Hand picked watch look center",
    href: "/product/sunmate-green-edition",
  },
  {
    src: "/images/hand picked/right.png",
    alt: "Hand picked watch look right",
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
  return products.filter((p) => p.newLaunch && !p.featured);
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
