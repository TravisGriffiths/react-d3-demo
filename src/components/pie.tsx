import { CarDataSchema } from "../constants/data";
import React from "react";
import { RightContainer } from "./containers";
import styled from "styled-components";
import { descending, max,  rank } from 'd3-array';
import { arc, pie } from "d3-shape";
import { KeyValuePair, Point, Size } from "../types";
import { getTopNEntriesWithAggrigatedOther, sortDecending } from "../utils";
import { CategoryPaletteA } from "../constants/palettes";

const MAX_WEDGES = 12; // too many wedges is impossible to read


interface PieData {
   title: string;
   data: Map<string, number>;
   size: Size;
}

interface WedgeMetaData {
   index: number;
   label: string;
   className: string;
   centroid: Point;
   color: string;
}

const Pie: React.FC<PieData> = ({data, size, title}) => {
   /* Need to do some cleanup as only a certain number of wedges graph well */
   const aggregated = getTopNEntriesWithAggrigatedOther(data, MAX_WEDGES)
   
   const center = {x: Math.floor(size.width / 2), y: Math.floor(size.height / 2)}
   const longestSize = max([size.height, size.width])
   const radius = longestSize ? Math.floor(longestSize / 3) : Math.floor(size.height / 3) 

   const sortedDataArray = Array.from(aggregated).sort(
      (a: KeyValuePair, b: KeyValuePair) => descending(a[1], b[1])); 


   const wedges = pie()(sortedDataArray.map((d: KeyValuePair) => d[1]))
   const arcGenerator = arc().cornerRadius(3).padAngle(.003)
   const arcs = wedges.map((wedge) => arcGenerator({
      innerRadius: 0,
      outerRadius: radius,
      startAngle: wedge.startAngle, 
      endAngle: wedge.endAngle
   })).filter(Boolean) as string[]; // Nulls really are filtered

   // const getWedgeCategoryClassName = (index: number): string => {

   // }

   return (
      <RightContainer>
         {title}
         <svg height={size.height} width={size.width}>
            <g transform={`translate(${center.x}, ${center.y})`} >
            { arcs.map((arc, idx) => (
               <path key={idx} d={arc} fill={CategoryPaletteA[idx]}/>
            )) }
            </g>
         </svg>
       </RightContainer>
   )
}

export default Pie;