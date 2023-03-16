import React from "react";
import SearchRestaurantCard from "./components/SearchRestaurantCard";
import SearchHeader from "./components/SearchHeader";
import SearchSideBar from "./components/SearchSideBar";
import { PRICE, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const fetchRestaurantsByCity = (searchParams: SearchParams) => {
  const where: any = {};
  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLocaleLowerCase(),
      },
    };
    where.location = location;
  }
  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLocaleLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }
  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }
  // prisma.restaurant.findMany({
  //   where: {
  //     location: {
  //       name: {
  //         equals: "toronto",
  //       },
  //     },
  //     cuisine: {
  //       name: {
  //         equals: "mexican",
  //       },
  //     },
  //     price: {
  //       equals: PRICE.CHEAP,
  //     },
  //   },
  // });
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  // if (!city) {
  //   return prisma.restaurant.findMany({ select });
  // }
  return prisma.restaurant.findMany({
    where,
    select,
  });
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};

const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  const restaurants = await fetchRestaurantsByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => (
                <SearchRestaurantCard
                  restaurant={restaurant}
                  key={restaurant.id}
                />
              ))}
            </>
          ) : (
            <p>Sorry, we found no restaurants in this area!</p>
          )}
        </div>
      </div>
    </>
  );
}
