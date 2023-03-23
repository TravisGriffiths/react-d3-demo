import { CarDataSchema } from "../constants/data";
import React from "react";
import { RightContainer } from "./containers";
import styled from "styled-components";
import { descending,  rank } from 'd3-array';
import { arc, pie } from "d3-shape";
import { Datum, Size } from "../types";

const MAX_WEDGES = 12;


type PieData = {
   data: Map<string, number>,
   size: Size,
}

const Pie: React.FC<PieData> = ({data}) => {
   /* Need to do some cleanup as only a certain number of wedges graph well */
   const entries = Array.from(data).map((entry) => ({label: entry[0], value: entry[1]}))
   const rankings = rank(entries, (a: Datum, b: Datum) => descending(a.value, b.value))
   let otherCategoryValue = 0
   rankings.forEach((rank, index) => {
      if(rank > MAX_WEDGES) {
         otherCategoryValue += data.get(entries[index]?.label) || 0
         data.delete(entries[index]?.label)
      }
   });
   data.set('Others', otherCategoryValue)

   const wedges = pie()(Array.from(data).map((d) => d[1]))
   const arcGenerator = arc()
   const arcs = wedges.map((wedge) => arcGenerator({
      innerRadius: 0,
      outerRadius: 200,
      startAngle: wedge.startAngle, 
      endAngle: wedge.endAngle
   })).filter(Boolean) as string[]


   return (
      <RightContainer>
         Simple Pie Chart
         <svg height={600} width={800}>
            <g transform={`translate(400, 300)`} >
            { arcs.map((arc, idx) => (
               <path key={idx} d={arc} />
            )) }
            </g>
         </svg>
       </RightContainer>
   )
}

export default Pie;