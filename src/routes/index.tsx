import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryMosaic } from "@/components/home/category-mosaic";
import { NewLaunches } from "@/components/home/new-launches";
import { HandPicked } from "@/components/home/hand-picked";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <CategoryMosaic />
      <NewLaunches />
      <HandPicked />
    </main>
  );
}
