import { Link } from "react-router-dom";
import {
  Button,
  Flex,
  Box,
  Heading,
  Divider,
  FormControl,
  Input,
  FormHelperText,
  Stack,
} from '@chakra-ui/react';
import { BookItem } from "../book-card/book-card";

export function FindBook() {
  return (
    <Box>
      <Flex direction={ 'column' } gap={ '20px' }>
        <Heading size={ 'lg' }>Найти книгу</Heading>

        <FormControl isRequired>
          <Input placeholder="Поисковый запрос" />
          <FormHelperText>Искать можно по автору и наименованию книги.</FormHelperText>
        </FormControl>

        <Button colorScheme='gray' variant={ 'solid' }>
          Найти
        </Button>
      </Flex>

      <Divider margin={ '20px 0' } />

      <Stack>
        <BookItem />
        <BookItem />
        <BookItem />
        <BookItem />
      </Stack>

      <Divider margin={ '20px 0' } />

      <Link to={ '/' }>
        <Button colorScheme='gray' variant={ 'solid' }>
          В меню
        </Button>
      </Link>
    </Box>
  )
}