CREATE TABLE IF NOT EXISTS note (
                                    id SERIAL PRIMARY KEY,
                                    text TEXT NOT NULL,
                                    created_at TIMESTAMPTZ DEFAULT now()
    );
