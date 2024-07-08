import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import debounce from 'lodash.debounce';
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
  useToast,
} from '@chakra-ui/react';

import { BookItem } from "../book-card/book-card";
import { searchBook } from '../../api';

export function FindBook() {
  const [books, setBooks] = useState([]);

  const toast = useToast();

  const onSearchBook = (event) => {
    console.log('on search book');
    const value = event.target.value;

    if (!value.trim() || value.length < 2) {
      setBooks([]);
      return;
    }

    searchBook(123, value).then(response => {
      setBooks(response);
    }).catch(error => {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: "Произошла ошибка при поиске книги. Попробуйте повторить операцию позже.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })

    })
  }

  const debouncedSearchBook = useMemo(() => debounce(onSearchBook, 400), []);

  return (
    <Box>
      <Flex direction={ 'column' } gap={ '20px' }>
        <Heading size={ 'lg' }>Найти книгу</Heading>

        <FormControl isRequired>
          <Input placeholder="Поисковый запрос" onChange={ debouncedSearchBook } />
          <FormHelperText>Искать можно по автору и наименованию книги.</FormHelperText>
        </FormControl>
      </Flex>

      <Divider margin={ '20px 0' } />

      <Stack>
        { books.map(book => (
          <BookItem key={ book.id } data={ book } />
        )) }
      </Stack>

      { books.length > 0 && <Divider margin={ '20px 0' } /> }

      <Link to={ '/' }>
        <Button colorScheme='gray' variant={ 'solid' }>
          В меню
        </Button>
      </Link>
    </Box>
  )
}