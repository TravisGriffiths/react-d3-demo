import { LeftContainer } from "./containers";
import React from "react";
import { Copy } from "../types";
import styled from "styled-components";

type PanelProps = {
   copy: Copy;
}

const CopyBox = styled(LeftContainer)`
   text-align: left;
`

const Panel: React.FC<PanelProps> = ({ copy }) => {

   return (
      <CopyBox>
         {copy}
      </CopyBox>
   )
}

export default Panel;