import { Link } from "react-router-dom";
import {
  Button,
  Flex,
  Box,
  Heading,
  Divider,
} from '@chakra-ui/react';

export function QuickStats() {
  return (
    <Box>
      <Flex direction={ 'column' } gap={ '20px' }>
        <Heading>Статистика</Heading>

        <Button colorScheme='teal' w={ '100%' }>
          Количество прочитанных за текущий месяц
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Количество прочитанных за текущий год
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Список прочитанных за текущий месяц
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Список прочитанных за текущий год
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Список прочитанных за выбранный месяц
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Список прочитанных за выбранный год
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Количество прочитанных
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Список прочитанных
        </Button>
        <Button colorScheme='teal' w={ '100%' }>
          Список незаконченных
        </Button>
      </Flex>

      <Divider margin={ '20px 0' } />

      <Link to={ '/' }>
        <Button colorScheme='gray' variant={ 'solid' }>
          В меню
        </Button>
      </Link>
    </Box>
  )
}