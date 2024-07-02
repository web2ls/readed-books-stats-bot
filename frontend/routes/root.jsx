import { Link } from "react-router-dom";
import {
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';

export function Root() {
  return (
    <Flex direction={ 'column' } gap={ '20px' }>
      <Heading>Мета библиотека</Heading>

      <Link to={ 'add' }>
        <Button colorScheme='teal' w={ '100%' }>
          Добавить книгу
        </Button>
      </Link>

      <Link to={ 'find' }>
        <Button colorScheme='teal' w={ '100%' }>
          Найти книгу
        </Button>
      </Link>

      <Link to={ 'quickstats' }>
        <Button colorScheme='teal' w={ '100%' }>
          Статистика
        </Button>
      </Link>
    </Flex>
  )
}