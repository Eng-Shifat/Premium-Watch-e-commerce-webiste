export type OrderItem = { slug: string; name: string; price: number; qty: number };

export type Order = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
  items: OrderItem[];
  total: number;
  status: "processing" | "shipped" | "delivered";
};

const KEY = "urbantick-orders";

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function listOrders(): Order[] {
  return read();
}

export function getOrder(id: string): Order | undefined {
  return read().find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export function placeOrder(input: Omit<Order, "id" | "createdAt" | "status">): Order {
  const id = `UT-${Math.floor(10000 + Math.random() * 90000)}`;
  const order: Order = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    status: "processing",
  };
  write([order, ...read()]);
  return order;
}
