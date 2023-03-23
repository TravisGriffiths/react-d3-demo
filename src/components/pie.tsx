import React, { ReactNode } from "react";
import { RightContainer } from "./containers";
import { descending, max } from 'd3-array';
import { arc, pie } from "d3-shape";
import { color } from "d3-color";
import { schemeSet3 } from 'd3-scale-chromatic';
import { KeyValuePair, Point, Size } from "../types";
import { getTopNEntriesWithAggrigatedOther, isDefined } from "../utils";

const MAX_WEDGES = 11; // too many wedges is impossible to read
const KEY = 0;
const VALUE = 1;

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
   angle: number;
   color: string;
}

const Pie: React.FC<PieData> = ({data, size, title}) => {
   /* Need to do some cleanup as only a certain number of wedges graph well */
   const aggregated = getTopNEntriesWithAggrigatedOther(data, MAX_WEDGES)
   
   const center = {
      x: Math.floor(size.width / 2), 
      y: Math.floor(size.height / 2)
   }
   const longestSize = max([size.height, size.width])
   const outerRadius = longestSize ? 
      Math.floor(longestSize / 3) : 
      Math.floor(size.height / 3) 
   const radius = {
      innerRadius:  Math.floor(outerRadius/2),
      outerRadius,
   }
   const baseLabelRadius = radius.outerRadius + 20;

   const sortedDataArray = Array.from(aggregated).sort(
      (a: KeyValuePair, b: KeyValuePair) => descending(a[VALUE], b[VALUE])
   ); 
   
   const wedges = pie()(sortedDataArray.map((d: KeyValuePair) => d[VALUE]))
   const arcGenerator = arc().cornerRadius(3).padAngle(.003)
   const getCentroid = arcGenerator.centroid;
   const arcs = wedges.map((wedge) => arcGenerator({
      startAngle: wedge.startAngle, 
      endAngle: wedge.endAngle,
      ...radius
   })).filter(isDefined)

   const palette = schemeSet3.map((c) => 
      color(c)?.darker(1.5).toString()
   ).filter(isDefined)


   const metadata = new Map<number, WedgeMetaData>();
   wedges.forEach((wedge, index) => {

      const centroid = getCentroid({
         startAngle: wedge.startAngle, 
         endAngle: wedge.endAngle,
         ...radius
      })

      const label = sortedDataArray[index][KEY];

      const meta = {
         index,
         label,
         className: label.toLowerCase(),
         centroid: {
            x: (centroid[0] + center.x),
            y: (centroid[1] + center.y)
         },
         angle: wedge.startAngle + ((wedge.endAngle - wedge.startAngle)/2),
         color: palette[index]
      }

      metadata.set(index, meta)
   });

   const labels: ReactNode[] = [];
   /* Because lablels start at a point eqidistant out from the center and label left to right,
      labels on the right tend to be perfectly placed, while on the left they collide into 
      the element they are labeling, this causes the most left to 'fly out' more to space them */ 
   const labelXSpacer = (angle: number) => {
      if (angle > Math.PI) {
         return (Math.sin(angle) * 3.5) ** 3 - 20 
      }
      return 0
   } 

   // The small wedges at the end tend to collide, space them a bit
   const labelYSpacer = (angle: number, index: number) => {
      if (angle > ((13/8)*Math.PI)) {
         
         return (sortedDataArray.length - index - 1) * 4
      }
      return 0
   }

   metadata.forEach((meta, index) => {
      labels.push(<text 
         x={(Math.sin(meta.angle) * baseLabelRadius) + center.x + labelXSpacer(meta.angle) }
         y={
            (Math.cos(meta.angle) * baseLabelRadius * -1) + 
            center.y + 
            labelYSpacer(meta.angle, index)
         }>{meta.label}</text>)
   });



   return (
      <RightContainer>
         <h3>{title}</h3>
         <svg height={size.height} width={size.width}>
            <g transform={`translate(${center.x}, ${center.y})`} >
            { arcs.map((arc, idx) => (
               <path key={idx} d={arc} fill={palette[idx]}/>
            )) }
            </g>
            <g>
               { labels.map((label) => label) }
            </g>
         </svg>
       </RightContainer>
   )
}

export default Pie;