import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/core";
import ComposeQuarter from './composeQuarter';
import ComposeTeam from './composeTeam';
import {BaseballProvider} from './teamContext';



export default function BaseBallTeam() {
    const [tabIndex, setTabIndex] = React.useState(0);
  
  
    const handleTabsChange = index => {
      setTabIndex(index);
    };
  
    return (
      <Box w="100%" p={4} >
        
        <Tabs index={tabIndex} onChange={handleTabsChange}>
          <TabList>
            <Tab>Compose Team</Tab>
            <Tab>First Quarter</Tab>

          </TabList>
          <BaseballProvider>
            <TabPanels>
                <TabPanel>
                    <ComposeTeam/>
                </TabPanel>
                <TabPanel>
                    <ComposeQuarter/>
                </TabPanel>
            </TabPanels>
          </BaseballProvider>

        </Tabs>
      </Box>
    );
  }