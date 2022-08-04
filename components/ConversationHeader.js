import { Heading, Flex, Text, Image } from "@chakra-ui/react";
import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";


export function ConversationHeader() {
    const { user, currentConversationDetails, getTruncatedDID, orbis } = useContext(GlobalContext);

    console.log("This is the current loaded conversation:", currentConversationDetails);

    return (
        <Flex
            direction='column'>
            {currentConversationDetails && (
                <Heading
                    as='h2'
                    fontSize='md'
                >
                    {currentConversationDetails.content.name ? currentConversationDetails.content.name : getTruncatedDID(currentConversationDetails.content.recipients[0], 5)}
                </Heading>
            )}
            <Flex
                direction='row'>
                {currentConversationDetails && currentConversationDetails.recipients_details.map((recipient, index) => {
                    return (
                        <Flex
                            key={index}
                            direction="row"
                            gap={1}
                            justify='space-evenly'
                            p={1}>
                            {recipient.profile.pfp ? <Image
                                w={4}
                                h={4}
                                borderRadius="50%"
                                src={recipient.profile.pfp} alt="profile picture" />
                                :
                                <Image
                                    w={4}
                                    h={4}
                                    borderRadius="50%"
                                    src="/defaultPFP.jpeg" alt="profile picture" />
                            }
                            <Text
                                fontSize='xs'>
                                {recipient.profile?.username ?
                                    recipient.profile.username
                                    :
                                    getTruncatedDID(recipient.did, 3)}
                            </Text>
                        </Flex>
                    )
                })}
            </Flex>
        </Flex>
    )
}