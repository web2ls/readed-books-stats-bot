import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
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
import { getBook, editBook } from '../../api';

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

export function EditBook() {
  const [formState, setFormState] = useState(initialFormState);
  const [isAuthorError, setIsAuthorError] = useState(false);
  const [isTitleError, setIsTitleError] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
  useNumberInput({
    step: 0.1,
    precision: 1,
    min: 0,
    max: 5,
  });

  const incProps = getIncrementButtonProps();
  const decProps = getDecrementButtonProps();
  const input = getInputProps();

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

  const normalizeRatingValue = (value) => {
    if (value > 5) {
      value = 5;
    } else if (value < 1) {
      value = 1;
    }

    return value.toFixed(1);
  }

  const incrementRating = () => {
    if (!Number(ratingValue)) {
      setRatingValue(1);
      return;
    }

    let newValue = Number(ratingValue) + 0.1;
    setRatingValue(normalizeRatingValue(newValue));
  }

  const decrementRating = () => {
    if (!Number(ratingValue)) {
      setRatingValue(1);
      return;
    }

    let newValue = Number(ratingValue) - 0.1;
    setRatingValue(normalizeRatingValue(newValue));
  }

  const handleChangeRatingInput = (event) => {
    const newValue = event.target.value;

    setRatingValue(newValue);
  }

  const handleBlurRatingInput = () => {
    if (isNaN(ratingValue) || Number(ratingValue) === 0) {
      setRatingValue(0);
      return;
    }

    setRatingValue(normalizeRatingValue(Number(ratingValue)));
  }

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
      author: validateString(formState.author),
      title: validateString(formState.title),
      review: validateString(formState.review),
      rating: ratingValue ? ratingValue : 0,
    }

    editBook(data).then(() => {
      navigate(-1);
      toast({
        title: 'Книга обновлена',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }).catch(error => {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: "Произошла ошибка при обновлении книги. Попробуйте повторить операцию позже.",
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
          <NumberInput min={ 0 } value={ Number(formState.pages_amount) } >
            <NumberInputField onChange={ (event) => updateFormState('pages_amount', event.target.value) } />
          </NumberInput>
        </FormControl>

        <FormControl>
            <FormLabel>Рейтинг</FormLabel>
            <HStack>
              <Button {...incProps} onClick={ incrementRating } >+</Button>
              <Input {...input} value={ ratingValue } onChange={ handleChangeRatingInput } onBlur={ handleBlurRatingInput } />
              <Button {...decProps} onClick={ decrementRating } >-</Button>
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
          <Button colorScheme='red' variant={ 'solid' } onClick={ () => navigate(-1) }>
            Отмена
          </Button>
          <Button colorScheme='green' variant={ 'solid' } type="submit" onClick={ onSubmit }>Обновить</Button>
        </ButtonGroup>
      </Center>
    </Box>
  )
}