import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../auth";
import type {JSX} from "react";

export default function UserProtectedRoute({ children }: { children: JSX.Element }) {
    if (!isUserLoggedIn()) return <Navigate to="/login" replace />;
    return children;
}
