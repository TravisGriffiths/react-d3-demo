import { Copy } from "../types"

export const piePanelCopy: Copy = `
This is a basic pie chart done in React and D3. While both of these libraries are very powerful, 
there is a natural problem that arises when using them together in that they both want display a 
set of state (data) by essentially binding that data to the DOM, making the displayed DOM dependent
on changes in the bound state. 

Both libraries do this job exceptionally well, and are built for totally different cases, but 
combining them creates a natural problem of the two competing for control of the DOM. However, 
there are multiple methods that can be used to fix this issue. 
`