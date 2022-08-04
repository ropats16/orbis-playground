import { Divider, Flex } from "@chakra-ui/react";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationMessages } from "./ConversationMessages";


export function ConversationBox() {

    return (
        <Flex
            m={5}
            p={5}
            border='1px'
            borderRadius='10px'
            direction='column'
        >
            <ConversationHeader />
            <Divider mb={3} />
            <ConversationMessages />
        </Flex>
    )
}