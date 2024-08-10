import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {
  FormControl,
  FormLabel,
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
  useToast,
} from '@chakra-ui/react';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from 'date-fns/locale/ru';

import { getBook } from '../../api';

import "react-datepicker/dist/react-datepicker.css";

registerLocale('ru', ru);
setDefaultLocale('ru');

const initialFormState = {
  author: '',
  title: '',
  started_at: new Date(),
  finished_at: new Date(),
  pages_amount: 0,
  rating: '',
  review: '',
};

export function ViewBook() {
  const [formState, setFormState] = useState(initialFormState);
  const [ratingValue, setRatingValue] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    getBook(id).then(response => {
      setFormState(response);
      setRatingValue(response.rating);
    }).catch(error => {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: "Произошла ошибка при попытке загрузить данные. Попробуйте повторить операцию позже.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    })
  }, []);

  return (
    <Box>
      <Flex direction={ 'column' } gap={ '20px' }>
        <FormControl >
          <FormLabel>Автор</FormLabel>
          <Input value={ formState.author } disabled={ true } />
        </FormControl>

        <FormControl disa>
          <FormLabel>Наименование</FormLabel>
          <Input value={ formState.title } disabled={ true } />
        </FormControl>

        <FormControl>
          <FormLabel>Когда начали читать</FormLabel>
          <DatePicker
            selected={formState.started_at}
            dateFormat={ 'dd.MM.yyyy' }
            disabled={ true }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Когда закончили читать</FormLabel>
          <DatePicker
            selected={formState.finished_at}
            dateFormat={ 'dd.MM.yyyy' }
            disabled={ true }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Количество страниц</FormLabel>
          <NumberInput min={ 0 } value={ Number(formState.pages_amount) } >
            <NumberInputField disabled={ true } />
          </NumberInput>
        </FormControl>

        <FormControl>
            <FormLabel>Рейтинг</FormLabel>
              <Input value={ ratingValue } disabled={ true } />
          </FormControl>

        <FormControl>
          <FormLabel>Обзор</FormLabel>
          <Textarea value={ formState.review } onChange={ (event) => updateFormState('review', event.target.value) } disabled={ true } />
        </FormControl>
      </Flex>

      <Divider marginTop={ '20px' } marginBottom={ '20px' } />

      <Button colorScheme='gray' variant={ 'solid' } onClick={ () => navigate(-1) }>
        Назад
      </Button>
    </Box>
  )
}