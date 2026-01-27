import { Route, Routes, HashRouter } from 'react-router-dom';
import App from './App';
// import { LandingPage } from './pages/landing-page';

export const ROUTE_PATHS: any = {
  landing: '/',
  success: '/success',
  cancel: '/cancel',
};

interface IRoute {
  path: string;
  element: JSX.Element;
}

export const routes: IRoute[] = [
  // {
  //   path: ROUTE_PATHS.landing,
  //   element: <LandingPage />,
  // },
  {
    path: ROUTE_PATHS.landing,
    element: <App />,
  },
  {
    path: ROUTE_PATHS.success,
    element: <div>Success</div>,
  }, 
  {
    path: ROUTE_PATHS.cancel,
    element: <div>Cancel</div>,
  },
 
];



export function BindRoutes(props: { children?: React.ReactNode }): JSX.Element {
  return (
    <HashRouter>
        <Routes>
        {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
        ))}
        </Routes>
    </HashRouter>
  );
}
