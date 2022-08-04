import React, { useState, useContext } from 'react';
import { sleep } from "../utils";

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";
import { Button } from '@chakra-ui/react';

export function ConnectButton() {
    const { user, setUser, getTruncatedDID, orbis } = useContext(GlobalContext);
    const [status, setStatus] = useState(0);

    /** Call the Orbis SDK to connect to Ceramic */
    const connect = async () => {
        /** Show loading state */
        setStatus(1);

        let res = await orbis.connect();

        /** Parse result and update status */
        switch (res.status) {
            case 200:
                setStatus(2);

                /** Save user details returned by the connect function in state */
                console.log("Connected to Ceramic: ", res);
                setUser(res.details);

                break;
            default:
                console.log("Couldn't connect to Ceramic: ", res.error.message);
                setStatus(3);

                /** Wait for 2 seconds before resetting the button */
                await sleep(2000);
                setStatus(0);
        }
    }

    const getUserDetails = async (did) => {
        let { data, error, status } = await orbis.getProfile(did);

        /** Returns error if any */
        if (error) {
            return {
                status: status,
                result: "Error retrieving user details.",
                error: error
            }
        }

        /** Returns user details */
        return {
            status: status,
            result: data
        }
    }

    /** Display button according to its status */
    switch (status) {
        case 0:
            return <Button colorScheme='teal' onClick={() => connect()}>Connect</Button>;
        case 1:
            return <Button colorScheme='gray'>Loading...</Button>;
        case 2:
            return <Button colorScheme='cyan'>{user.profile?.username ?
                user.profile.username
                :
                getTruncatedDID(user.did, 5)}</Button>;
        case 3:
            return <Button colorScheme='pink'>Error</Button>

    }
}   
