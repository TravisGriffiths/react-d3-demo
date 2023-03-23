import React from 'react'
import './App.css'
import Panel from './components/panel';
import Pie from './components/pie';
import { getSalesByManufacturer } from './utils';
import { piePanelCopy } from './constants/copy';
import { sourceData } from './constants/data';
import styled from "styled-components";

const AppContainer = styled.div`
   display: flex;
   justify-content: center;
   gap: 1rem;
`;

const App: React.FC = () => {
  
  

  return (
    <AppContainer>
        <Panel copy={piePanelCopy} />
         <Pie 
          title="Car Sales by Manufacturer"
          data={getSalesByManufacturer(sourceData)} 
          size={{width: 800, height: 600}}  />

    </AppContainer>

  )
}

export default App
