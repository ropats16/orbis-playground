import Head from 'next/head'
import { Divider, Flex, Heading } from '@chakra-ui/react';
import styles from '../styles/Home.module.css'
import { useEffect, useState, useContext } from 'react';

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";

import { Header } from '../components/Header';
import { ConversationButtons } from '../components/ConversationButtons';
import { ConversationBox } from '../components/ConversationBox';

export default function Home() {
    const { user, setUser, orbis } = useContext(GlobalContext);

    return (
        <div className={styles.container}>
            <Head>
                <title>OrbiSlack</title>
                <meta name="Composable Slack-like dashboard built on Orbis" content="Created by Ropats" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <Header />
            </header>
            <Divider />
            {user ?
                <Flex as='main'>
                    <ConversationButtons />
                    <ConversationBox />
                </Flex>
                :
                <Heading as='h2' fontSize='lg' m={5}>Please connect your wallet!</Heading>
            }
        </div >
    )
}

// did:pkh:eip155:5:0x1a5b1d94a576d56e8556924d7935ecef00a797f4,did:pkh:eip155:1:0x9fd07f4ee4f18e27f9d958fb42e8ea2e6ee547bd,did:pkh:eip155:1:0x075286d1a22b083ebcaf6b7fb4cf970cfc4a18f0