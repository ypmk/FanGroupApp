import { useState } from "react";
import { createMerch } from "../api";
import { useNavigate } from "react-router-dom";
import {clearAdminToken} from "../auth.ts";

export default function AdminMerchPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const navigate = useNavigate();

    async function onCreate(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);
        setErr(null);

        try {
            await createMerch({ title, description, price, imageUrl });
            setMsg("Product created");
            setTitle("");
            setDescription("");
            setPrice(0);
        } catch (e: any) {
            setErr(e.message ?? "Failed");
        }
    }

    function logout() {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
    }

    return (
        <div style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Admin: Merch</h1>
                <button onClick={logout}>Logout</button>
            </div>

            <form onSubmit={onCreate} style={{ display: "grid", gap: 12 }}>
                <label>
                    Title
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>

                <label>
                    Description
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>

                <label>
                    Price
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </label>

                <label>
                    Image URL
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </label>

                <button type="submit">Create</button>
            </form>

            {msg && <p>{msg}</p>}
            {err && <p style={{ color: "crimson" }}>{err}</p>}
        </div>
    );
}
