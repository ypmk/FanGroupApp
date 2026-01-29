import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { MerchPage } from "./pages/MerchPage";
import { StudioPage } from "./pages/StudioPage";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-zinc-950 text-white">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/merch" element={<MerchPage />} />
                    <Route path="/studio" element={<StudioPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
