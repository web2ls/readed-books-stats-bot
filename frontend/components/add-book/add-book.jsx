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

import { isFieldEmpty, validateString } from '../../helpers';
import { addBook } from '../../api';

import "react-datepicker/dist/react-datepicker.css";

registerLocale('ru', ru);
setDefaultLocale('ru');

const initialFormState = {
  author: '',
  title: '',
  startedAt: new Date(),
  finishedAt: new Date(),
  pagesAmount: 0,
  rating: 0,
  review: '',
};

export function AddBook() {
  const [formState, setFormState] = useState(initialFormState);
  const [isAuthorError, setIsAuthorError] = useState(false);
  const [isTitleError, setIsTitleError] = useState(false);

  const onSubmit = () => {
    setIsAuthorError(false);
    setIsTitleError(false);

    console.log(formState);

    if (isFieldEmpty(formState.author)) {
      setIsAuthorError(true);
      return;
    }

    if (isFieldEmpty(formState.title)) {
      setIsTitleError(true);
      return;
    }

    const data = {
      ...formState,
      author: validateString(formState.author),
      title: validateString(formState.title),
      review: validateString(formState.review),
    }

    addBook(data).then(response => {
      console.log('success');
    }).catch(error => {
      console.error(error);
    })
  }

  const updateFormState = (field, value) => {
    setFormState({
      ...formState,
      [field]: value
    })
  };

  return (
    <Box>
      <Flex direction={ 'column' } gap={ '20px' }>
        <FormControl isRequired isInvalid={ isAuthorError }>
          <FormLabel>Автор</FormLabel>
          <Input value={ formState.author } onChange={ (event) => updateFormState('author', event.target.value) } />
          <FormErrorMessage>Поле обязательное</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={ isTitleError }>
          <FormLabel>Наименование</FormLabel>
          <Input value={ formState.title } onChange={ (event) => updateFormState('title', event.target.value) } />
          <FormErrorMessage>Поле обязательное</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Когда начали читать</FormLabel>
          <DatePicker selected={formState.startedAt} onChange={(date) => updateFormState('startedAt', date)} dateFormat={ 'dd.MM.yyyy' } isClearable />
          <FormHelperText>Кликните по дате, чтобы выбрать.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Когда закончили читать</FormLabel>
          <DatePicker selected={formState.finishedAt} onChange={(date) => updateFormState('finishedAt', date)} dateFormat={ 'dd.MM.yyyy' } isClearable />
          <FormHelperText>Кликните по дате, чтобы выбрать.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Количество страниц</FormLabel>
          <NumberInput defaultValue={ 0 } min={ 0 } >
            <NumberInputField value={ formState.pagesAmount } onChange={ (event) => updateFormState('pagesAmount', event.target.value) } />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Рейтинг</FormLabel>
          <NumberInput defaultValue={ 0 } min={ 0 } max={ 5 } precision={ 1 } >
            <NumberInputField value={ formState.rating } onChange={ (event) => updateFormState('rating', event.target.value) } />
          </NumberInput>
          <FormHelperText>Укажите ваш рейтинг по шкале от 1 до 5.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Обзор</FormLabel>
          <Textarea value={ formState.review } onChange={ (event) => updateFormState('review', event.target.value) } />
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
          <Button colorScheme='green' variant={ 'solid' } type="submit" onClick={ onSubmit }>Добавить</Button>
        </ButtonGroup>
      </Center>
    </Box>
  )
}