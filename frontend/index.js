import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider, Box, Center } from '@chakra-ui/react';

import { Root } from "./routes/root";
import { ErrorPage } from './components/error-page/error-page';
import { AddBook } from './components/add-book/add-book';
import { FindBook } from './components/find-book/find-book';
import { QuickStats } from './components/quick-stats/quick-stats';
import { EditBook } from './components/edit-book/edit-book';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/add",
    element: <AddBook />
  },
  {
    path: "/find",
    element: <FindBook />
  },
  {
    path: "/quickstats",
    element: <QuickStats />
  },
  {
    path: "/edit/:id",
    element: <EditBook />
  },
]);

const container = document.getElementById("app");
const root = createRoot(container)
root.render(
  <StrictMode>
    <ChakraProvider>
      <Box margin={ '40px 0' }>
        <Center>
          <RouterProvider router={router} />
        </Center>
      </Box>
    </ChakraProvider>
  </StrictMode>
);