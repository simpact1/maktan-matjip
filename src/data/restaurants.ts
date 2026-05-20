import { Restaurant } from '../types/restaurant';
import rawData from './restaurants.json';

export const restaurants: Restaurant[] = rawData as Restaurant[];

export const pickupDropRestaurants = restaurants.filter((r) => r.pickupDrop);

export const resortMealRestaurants = restaurants.filter((r) => r.resortMeal.length > 0);
