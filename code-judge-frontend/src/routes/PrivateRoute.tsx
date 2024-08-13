// // src/routes/PrivateRoute.tsx
// import React from "react";
// import { Route, redirect, RouteProps } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// interface PrivateRouteProps {
//   component: React.ComponentType<any>;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({
//   component: Component,
//   ...rest
// }) => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Route
//       {...rest}
//       render={(props: any) =>
//         isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
//       }
//     />
//   );
// };

export {};
