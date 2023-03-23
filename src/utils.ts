import { CarDataSchema } from "./constants/data";
import { Datum, KeyValuePair } from "./types";
import { rank, descending } from "d3-array";

export const sortDecending = (a: Datum, b: Datum) => descending(a.value, b.value)

export const getSalesByManufacturer = (data: CarDataSchema[]): Map<string, number> => {
   const salesByManufacturer = new Map();
   data.forEach((datum) => {
      if (salesByManufacturer.get(datum.Manufacturer) === undefined) {
         salesByManufacturer.set(datum.Manufacturer, 0);
      }
      const current = salesByManufacturer.get(datum.Manufacturer);
      const sales = datum.Sales_in_thousands ? Number(datum.Sales_in_thousands) : 0
      salesByManufacturer.set(datum.Manufacturer, (current + sales))
   });
   return salesByManufacturer
}

export const getTopNEntriesWithAggrigatedOther = (data: Map<string, number>, max: number): Map<string, number> => {
   const aggregated = new Map(data)

   const entries = Array.from(aggregated).map((entry: KeyValuePair) => 
      ({label: entry[0], value: entry[1]})
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

