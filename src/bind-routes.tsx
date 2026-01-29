import { Route, Routes, HashRouter as Router } from 'react-router-dom';
import App from './App';
import SuccessPage from './components/SuccessPage';
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
    element: <SuccessPage />,
  }, 
  {
    path: ROUTE_PATHS.cancel,
    element: <div>Cancel</div>,
  },
 
];



export function BindRoutes(props: { children?: React.ReactNode }): JSX.Element {
  return (
    <Router>
        <Routes>
        {routes.map((route) => {
          console.log('route', route);
          return (
            <Route key={route.path} path={route.path} element={route.element} />
          );
        })}
        </Routes>
    </Router>
  );
}
