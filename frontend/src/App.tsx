import { useEffect, useState } from 'react';
import { API_URL } from './config';

function App() {
    const [message, setMessage] = useState('Запрос ещё не отправлен...');
    const [status, setStatus] = useState<'loading' | 'ok' | 'error' | 'idle'>('idle');

    useEffect(() => {
        setStatus('loading');
        fetch(`${API_URL}/api/hello`)
            .then((res) => res.text())
            .then((text) => {
                setMessage(text);
                setStatus('ok');
            })
            .catch((err) => {
                console.error(err);
                setMessage('Ошибка: ' + err.message);
                setStatus('error');
            });
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#111',
                color: '#0f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <h1>Frontend + Backend + Postgres (Docker)</h1>
            <p>Ответ от backend:</p>
            <pre style={{ fontSize: '1.5rem' }}>{message}</pre>
            <p>Статус: {status}</p>
        </div>
    );
}

export default App;
