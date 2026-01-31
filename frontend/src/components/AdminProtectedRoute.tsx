import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "../auth";
import type {JSX} from "react";

export default function AdminProtectedRoute({ children }: { children: JSX.Element }) {
    if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />;
    return children;
}
