import { useContext } from 'react';
import { format } from 'date-fns';
import { Avatar, Flex, Box, Divider, HStack } from "@chakra-ui/react"

import FirebaseContext from '../containers/FirebaseContext';
import allowedEmoticons from '../allowedEmoticons.json';

function ChatMessage(props) {
  const { auth } = useContext(FirebaseContext);
  const { text, uid, photoURL, createdAt } = props.message;

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
    <Box className={`message ${messageClass}`} mb={2}>
      <Box color="gray.400" mb={2}>{createdAt && format(createdAt.toDate(), 'dd/MM/yyy HH:mm:ss')}</Box>
      <Flex mb={2}>
        <Avatar src={photoURL} alt="" />
        <HStack ml={2}>{parseMessage(text)}</HStack>
      </Flex>
      <Divider />
    </Box>
  );
}

export default ChatMessage;
