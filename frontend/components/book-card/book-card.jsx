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
} from '@chakra-ui/react';

export function BookItem() {
  const imageUrl = new URL(
    '../../static/images/1.jpg?as=jpg&width=200',
    import.meta.url
  );

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
            wordBreak={ 'break-all' } size='md'>Наименование книги</Heading>

          <Text py='2' wordBreak={ 'break-all' }>
            Имя автора
          </Text>
        </CardBody>

        <CardFooter>
          <ButtonGroup variant='outline' spacing='6'>
            <Button variant='solid' colorScheme='gray'>
              Редактировать
            </Button>
            <Button variant='solid' colorScheme='red'>
              Удалить
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Stack>
    </Card>
  )
}