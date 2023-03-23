import { CarDataSchema } from "./constants/data";
import { DateString, Datum, KeyValuePair, NumberString } from "./types";
import { rank, descending } from "d3-array";

export const sortDecending = (a: Datum, b: Datum) => descending(a.value, b.value)

export const getSalesByManufacturer = (data: CarDataSchema[]): Map<string, number> => {
   const salesByManufacturer = new Map();
   data.forEach((datum) => {
      if (salesByManufacturer.get(datum.Manufacturer) === undefined) {
         salesByManufacturer.set(datum.Manufacturer, 0);
      }
      const current = salesByManufacturer.get(datum.Manufacturer);
      const sales = datum.Sales_in_thousands ? 
         Number(datum.Sales_in_thousands)    : 
         0
      salesByManufacturer.set(datum.Manufacturer, (current + sales))
   });
   return salesByManufacturer
}

const KEY = 0;
const VALUE = 1;

export const getTopNEntriesWithAggrigatedOther = (
   data: Map<string, number>, 
   max: number): Map<string, number> => {
   const aggregated = new Map(data)

   const entries = Array.from(aggregated).map((entry: KeyValuePair) => 
      ({label: entry[KEY], value: entry[VALUE]})
   );
   const rankings = rank(entries, sortDecending)

   let otherCategoryValue = 0
   rankings.forEach((rank, index) => {
      if(rank > max) {
         otherCategoryValue += aggregated.get(entries[index]?.label) || 0
         aggregated.delete(entries[index]?.label)
      }
   });
   data.set('Others', otherCategoryValue)
   return aggregated
}

export const isDefined = <V>(value: V | null | undefined): value is NonNullable<V> => 
   [
      (value !== null),
      (value !== undefined)
   ].every(Boolean) 

export const isDateString = (value: unknown): value is DateString =>  {
   if (typeof value === 'string') {
      return isNaN(new Date(value).valueOf()) === false
   }
   return false
}  

export const isNumberString = (value: unknown): value is NumberString => 
   [
      (typeof value === 'string'),
      (typeof Number(value) === 'number')
   ].every(Boolean)


