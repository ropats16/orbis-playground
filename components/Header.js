import { Flex, Text } from "@chakra-ui/react";
import { ConnectButton } from "./ConnectButton";

export function Header() {

    return (
        <Flex
            direction='row'
            justify='space-between'
            align='center'
            padding='10px 0'>
            <Text
                fontWeight='extrabold'
                fontStyle='italic'>
                OrbiSlack
            </Text>
            <ConnectButton />
        </Flex>
    )
}