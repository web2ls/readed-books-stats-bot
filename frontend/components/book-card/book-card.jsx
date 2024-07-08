import { useRef } from 'react';
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Image,
  Stack,
  CardBody,
  CardFooter,
  Heading,
  Text,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';

export function BookItem(props) {
  const { data, onDeleteBook } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const imageUrl = new URL(
    '../../static/images/1.jpg?as=jpg&width=200',
    import.meta.url
  );

  const handleDeleteBook = () => {
    onClose();
    onDeleteBook(data.id);
  }

  return (
    <Card
      w={ '100%' }
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '200px' }}
        src={ imageUrl }
        alt='Caffe Latte'
      />

      <Stack>
        <CardBody>
          <Heading
            wordBreak={ 'break-all' } size='md'>{ data.title }</Heading>

          <Text py='2' wordBreak={ 'break-all' }>
            { data.author }
          </Text>
        </CardBody>

        <CardFooter>
          <ButtonGroup variant='outline' spacing='6'>
            <Link to={ '/' }>
              <Button variant='solid' colorScheme='gray'>
                Редактировать
              </Button>
            </Link>
            <Button variant='solid' colorScheme='red' onClick={ onOpen }>
              Удалить
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Stack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Удаление книги
            </AlertDialogHeader>

            <AlertDialogBody>
              Уверены, что хотите удалить книгу?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Отмена
              </Button>
              <Button colorScheme='red' onClick={handleDeleteBook} ml={3}>
                Удалить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  )
}