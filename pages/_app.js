import React, { useState } from 'react';

import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'

/** Import Context */
import { GlobalContext } from '../contexts/GlobalContext';

/** Import Orbis SDK */
import { Orbis } from "@orbisclub/orbis-sdk";


/** Initiate the Orbis class object */
let orbis = new Orbis();

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [currentConversationDetails, setCurrentConversationDetails] = useState();

  const getTruncatedDID = (did, length) => {
    if (!did) {
      return '';
    }
    return `${did.slice(0, length + 2)}...${did.slice(
      did.length - length
    )}`;
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        currentConversationDetails,
        setCurrentConversationDetails,
        getTruncatedDID,
        orbis
      }}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </GlobalContext.Provider>
  )
}

export default MyApp
