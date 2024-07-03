import { useState } from 'react';
import { Link } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Input,
  Flex,
  Center,
  NumberInput,
  NumberInputField,
  Textarea,
  Button,
  ButtonGroup,
  Divider,
} from '@chakra-ui/react';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from 'date-fns/locale/ru';

import "react-datepicker/dist/react-datepicker.css";

registerLocale('ru', ru);
setDefaultLocale('ru');

export function AddBook() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Box>
      <Flex direction={ 'column' } gap={ '20px' }>
        <FormControl isRequired>
          <FormLabel>Автор</FormLabel>
          <Input />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Наименование</FormLabel>
          <Input />
        </FormControl>

        <FormControl>
          <FormLabel>Когда начали читать</FormLabel>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat={ 'dd.MM.yyyy' } />
          <FormHelperText>Кликните по дате, чтобы выбрать.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Когда закончили читать</FormLabel>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat={ 'dd.MM.yyyy' } />
          <FormHelperText>Кликните по дате, чтобы выбрать.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Количество страниц</FormLabel>
          <NumberInput defaultValue={ 0 } min={ 0 }>
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Рейтинг</FormLabel>
          <NumberInput defaultValue={ 0 } min={ 0 } max={ 5 } precision={ 1 }>
            <NumberInputField />
          </NumberInput>
          <FormHelperText>Укажите ваш рейтинг по шкале от 1 до 5.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Обзор</FormLabel>
          <Textarea />
          <FormHelperText>Напишите вашу мини рецензию на книгу.</FormHelperText>
        </FormControl>
      </Flex>

      <Divider marginTop={ '20px' } marginBottom={ '20px' } />

      <Center>
        <ButtonGroup variant='outline' spacing='6'>
          <Link to={ '/' }>
            <Button colorScheme='red' variant={ 'solid' }>
              Отмена
            </Button>
          </Link>
          <Button colorScheme='green' variant={ 'solid' } type="submit">Добавить</Button>
        </ButtonGroup>
      </Center>
    </Box>
  )
}