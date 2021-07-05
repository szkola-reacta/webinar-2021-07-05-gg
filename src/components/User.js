import { Box, Flex, ListItem, Divider } from '@chakra-ui/react';

function User({ data }) {
  return (
    <ListItem>
      <Flex p={2}>
        <Box><img src={`/statuses/${data.state}.png`} alt={data.state} /></Box>
        <Box ml={2}>
          <Box>{data.customName ? data.customName : data.displayName}</Box>
          <Box color="gray.400">{data.textStatus}</Box>
        </Box>
      </Flex>
      <Divider />
    </ListItem>
  );
}

export default User;
