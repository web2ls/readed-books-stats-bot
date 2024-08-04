import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  HStack,
  useToast,
  useNumberInput,
} from '@chakra-ui/react';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from 'date-fns/locale/ru';

import { isFieldEmpty, validateString } from '../../helpers';
import { addBook } from '../../api';

import "react-datepicker/dist/react-datepicker.css";

registerLocale('ru', ru);
setDefaultLocale('ru');

const DEFAULT_USERID = process.env.DEFAULT_USERID;

const initialFormState = {
  author: '',
  title: '',
  started_at: new Date(),
  finished_at: new Date(),
  pages_amount: null,
  rating: null,
  review: '',
};

export function AddBook() {
  const [formState, setFormState] = useState(initialFormState);
  const [isAuthorError, setIsAuthorError] = useState(false);
  const [isTitleError, setIsTitleError] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { value: ratingValue, getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
  useNumberInput({
    step: 0.1,
    min: 1,
    max: 5,
    precision: 1,
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const onSubmit = () => {
    setIsAuthorError(false);
    setIsTitleError(false);

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
      user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? DEFAULT_USERID,
      author: validateString(formState.author),
      title: validateString(formState.title),
      review: validateString(formState.review),
      rating: ratingValue ? Number(ratingValue).toFixed(2) : 0,
    }

    addBook(data).then(() => {
      navigate('/');
      toast({
        title: 'Книга добавлена',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }).catch(error => {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: "Произошла ошибка при добавлении книги. Попробуйте повторить операцию позже.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
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
          <DatePicker selected={formState.started_at} onChange={(date) => updateFormState('started_at', date)} dateFormat={ 'dd.MM.yyyy' } isClearable />
          <FormHelperText>Кликните по дате, чтобы выбрать.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Когда закончили читать</FormLabel>
          <DatePicker selected={formState.finished_at} onChange={(date) => updateFormState('finished_at', date)} dateFormat={ 'dd.MM.yyyy' } isClearable />
          <FormHelperText>Кликните по дате, чтобы выбрать.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Количество страниц</FormLabel>
          <NumberInput min={ 0 } >
            <NumberInputField value={ formState.pages_amount } onChange={ (event) => updateFormState('pages_amount', event.target.value) } />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Рейтинг</FormLabel>
          <HStack>
            <Button {...inc} >+</Button>
            <Input {...input} />
            <Button {...dec} >-</Button>
          </HStack>
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