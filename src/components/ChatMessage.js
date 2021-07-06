import { useContext } from 'react';
import { format } from 'date-fns';
import { Avatar, Flex, Box, Text, Divider, HStack } from "@chakra-ui/react"

import FirebaseContext from '../containers/FirebaseContext';
import allowedEmoticons from '../allowedEmoticons.json';

function ChatMessage(props) {
  const { auth } = useContext(FirebaseContext);
  const { text, uid, photoURL, createdAt, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  const parseMessage = (text) => {
    const pattern = /<([a-zA-Z1-9_]+)>/gim;
    const content = [];
    text.split(pattern).forEach((elem) => {
      if (allowedEmoticons.emoticons.includes(elem)) {
        content.push(<img src={`/emoticons/${elem}.gif`} alt={elem} />);
      } else {
        content.push(<div>{elem}</div>);
      }
    });
    return content;
  }

  return (
    <>
      <Box bgColor={messageClass === 'received' ? 'white' : 'gray.100' } p={2}>
        <Box color="gray.400" mb={2}>
          <Text>{createdAt && format(createdAt.toDate(), 'dd.MM.yyyy HH:mm:ss')} {displayName}</Text>
        </Box>
        <Flex mb={2}>
          <Avatar src={photoURL} alt="" />
          <HStack ml={2}>{parseMessage(text)}</HStack>
        </Flex>
      </Box>
      <Divider />
    </>
  );
}

export default ChatMessage;
