import App from "./App";
import RegisterUser from "./Components/RegisterUser";

const routes = [
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RegisterUser />,
      },
    ],
  },
];

export default routes;
