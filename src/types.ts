export type Copy = string;

export type NumberString = string;

export const isNumberString = (value: unknown): value is NumberString => 
   [
      (typeof value === 'string'),
      (typeof Number(value) === 'number')
   ].every(Boolean)


export type DateString = string;

export const isDateString = (value: unknown): value is DateString =>  {
   if (typeof value === 'string') {
      return isNaN(new Date(value).valueOf()) === false
   }
   return false
}  

export interface Size { 
   height: number;
   width: number;
}

export interface Datum {
   label: string;
   value: number;
}

export type KeyValuePair = [string, number];

export interface Point {
   x: number;
   y: number;
}