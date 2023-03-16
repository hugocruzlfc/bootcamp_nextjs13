import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";

import { PrismaClient, Cuisine, Location, PRICE, Review } from "@prisma/client";

export interface RestaurantCardType {
  id: number;
  name: string;
  cuisine: Cuisine;
  location: Location;
  main_image: string;
  price: PRICE;
  slug: string;
  reviews: Review[];
}
const prisma = new PrismaClient();

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      cuisine: true,
      location: true,
      main_image: true,
      price: true,
      slug: true,
      reviews: true,
    },
  });
  return restaurants;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();

  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            restaurant={restaurant}
            key={restaurant.id}
          />
        ))}
      </div>
    </main>
  );
}
