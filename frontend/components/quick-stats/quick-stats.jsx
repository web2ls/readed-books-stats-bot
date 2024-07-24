import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Divider,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { getQuickStats } from '../../api';

export function QuickStats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const userId = window.Telegram?.WebApp?.initData?.user?.id ?? 123;

    getQuickStats(userId).then(response => {
      setData(response);
    }).catch(error => {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: "Произошла ошибка при получении данных. Попробуйте повторить операцию позже.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    })
  }, []);

  return (
    <Box>
      <TableContainer>
        <Table variant='striped' colorScheme='teal' size='sm'>
          <TableCaption>Быстрая статистика по книгам</TableCaption>
          <Thead>
            <Tr>
              <Th>Категория</Th>
              <Th isNumeric>Количество</Th>
            </Tr>
          </Thead>
          <Tbody>
            { data.map(stat => (
              <Tr key={ stat.name }>
                <Td>{ stat.name }</Td>
                <Td isNumeric>{ stat.value }</Td>
              </Tr>
            )) }
          </Tbody>
        </Table>
      </TableContainer>

      <Divider margin={ '20px 0' } />

      <Link to={ '/' }>
        <Button colorScheme='gray' variant={ 'solid' }>
          В меню
        </Button>
      </Link>
    </Box>
  )
}