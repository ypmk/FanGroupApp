import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MerchPage } from "./pages/MerchPage";
import { StudioPage } from "./pages/StudioPage";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AdminMerchPage from "./pages/AdminMerchPage.tsx";
import PublicLayout from "./layouts/PublicLayout.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.tsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.tsx";
import AdminStudioPage from "./pages/AdminStudioPage.tsx";
import AdminUsersPage from "./pages/AdminUsersPage.tsx";
import CartPage from "./pages/CartPage.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-zinc-950 text-white">
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/merch" element={<MerchPage />} />
                        <Route path="/studio" element={<StudioPage />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Route>

                    <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/merch" element={<AdminMerchPage />} />
                        <Route path="/admin/studio" element={<AdminStudioPage />} />
                        <Route path="/admin/users" element={<AdminUsersPage></AdminUsersPage>} />
                    </Route>

                    <Route path="/admin/login" element={<AdminLoginPage />} />

                </Routes>
            </div>
        </BrowserRouter>
    );
}
