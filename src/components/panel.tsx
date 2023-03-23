import { LeftContainer } from "./containers";
import React from "react";
import styled from "styled-components";
import { Copy } from "../types";

type PanelProps = {
   copy: Copy;
}

const Panel: React.FC<PanelProps> = ({ copy }) => {

   return (
      <LeftContainer>
         {copy}
      </LeftContainer>
   )
}

export default Panel;