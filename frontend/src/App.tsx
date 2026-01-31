import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MerchPage } from "./pages/MerchPage";
import { StudioPage } from "./pages/StudioPage";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AdminMerchPage from "./pages/AdminMerchPage.tsx";
import PublicLayout from "./layouts/PublicLayout.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-zinc-950 text-white">
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/merch" element={<MerchPage />} />
                        <Route path="/studio" element={<StudioPage />} />
                    </Route>

                    <Route element={<AdminLayout />}>
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/admin/merch" element={
                            <AdminProtectedRoute><AdminMerchPage /></AdminProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}
