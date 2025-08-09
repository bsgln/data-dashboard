-- Survey Database Schema for Supabase
-- Санал асуулгын датабаазын схем

-- 1. Санал асуулгын асуултууд
CREATE TABLE survey_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    question_mn TEXT, -- Mongolian translation
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Хариултууд
CREATE TABLE survey_responses (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES survey_questions(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    category_mn TEXT, -- Mongolian translation
    vote_count INTEGER DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Санал өгсөн хүмүүс (optional: user tracking)
CREATE TABLE survey_votes (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES survey_questions(id),
    response_id INTEGER REFERENCES survey_responses(id),
    user_ip INET, -- IP tracking for uniqueness
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Daily vote tracking (midnight to midnight in Ulaanbaatar timezone)
CREATE TABLE daily_vote_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL, -- YYYY-MM-DD format in Ulaanbaatar timezone
    votes_at_start INTEGER DEFAULT 0, -- Vote count at start of day (12:00 AM)
    votes_at_end INTEGER DEFAULT 0, -- Current vote count
    daily_added INTEGER DEFAULT 0, -- Votes added during this day
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- 5. Metrics хадгалах
CREATE TABLE survey_metrics (
    id SERIAL PRIMARY KEY,
    total_votes INTEGER DEFAULT 0,
    daily_votes_added INTEGER DEFAULT 0,
    average_votes_per_minute DECIMAL(10,2) DEFAULT 0.00,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    top_budget_priority_category TEXT,
    top_budget_priority_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_question_total_votes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE survey_questions 
    SET total_votes = (
        SELECT COALESCE(SUM(vote_count), 0) 
        FROM survey_responses 
        WHERE question_id = NEW.question_id
    ),
    updated_at = NOW()
    WHERE id = NEW.question_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_question_total_votes
    AFTER INSERT OR UPDATE OF vote_count ON survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_question_total_votes();

-- Sample data
INSERT INTO survey_questions (id, question, question_mn, total_votes) VALUES
(1, 'Overall Budget Direction', 'Төсвийн ерөнхий чиглэл', 295199),
(2, 'Healthcare Budget', 'Эрүүл мэндийн төсөв', 295199),
(3, 'Education Budget', 'Боловсролын төсөв', 295199),
(4, 'Infrastructure Budget', 'Дэд бүтцийн төсөв', 295199),
(5, 'Tax Policy Support', 'Татварын бодлогын дэмжлэг', 147168),
(6, 'Privatization Program', 'Хувьчлалын хөтөлбөр', 148031);

-- Sample responses for question 5 (Tax Policy)
INSERT INTO survey_responses (question_id, category, category_mn, vote_count, percentage) VALUES
(5, 'Small Business Tax Relief', 'Жижиг би��несийн татварын хөнгөлөлт', 45250, 30.75),
(5, 'Corporate Tax Reduction', 'Байгууллагын татварын бууруулалт', 32100, 21.82),
(5, 'Personal Income Tax Cut', 'Хувь хүний орлогын татварын бууруулалт', 28900, 19.64),
(5, 'VAT Optimization', 'НӨАТ-ын оновчтол', 22018, 14.96),
(5, 'Tax System Simplification', 'Татварын тогтолцооны хялбарчлал', 18900, 12.84);

-- Sample responses for question 6 (Privatization)
INSERT INTO survey_responses (question_id, category, category_mn, vote_count, percentage) VALUES
(6, 'Energy Sector', 'Эрчим хүчний салбар', 28520, 19.27),
(6, 'Transportation', 'Тээврийн хэрэгсэл', 24890, 16.82),
(6, 'Mining Industry', 'Уул уурхайн үйлдвэрлэл', 21150, 14.29),
(6, 'Telecommunications', 'Харилцаа холбоо', 18970, 12.82),
(6, 'Banking Services', 'Банкны үйлчилгээ', 16220, 10.96),
(6, 'Agriculture', 'Хөдөө аж ахуй', 14560, 9.84),
(6, 'Manufacturing', 'Үйлдвэрлэл', 12340, 8.34),
(6, 'Healthcare Services', 'Эрүүл мэндийн үйлчилгээ', 6890, 4.65),
(6, 'Education Services', 'Боловсролын үйлчилгээ', 3251, 2.20),
(6, 'Tourism', 'Аялал жуулчлал', 1240, 0.84);

-- Initialize metrics
INSERT INTO survey_metrics (
    total_votes, 
    daily_votes_added, 
    average_votes_per_minute, 
    completion_percentage,
    top_budget_priority_category,
    top_budget_priority_percentage
) VALUES (
    295199, 
    1247, 
    24.8, 
    73.2,
    'Жижиг бизнесийн татварын хөнгөлөлт',
    30.75
);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_vote_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON survey_questions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON survey_responses FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON survey_metrics FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON daily_vote_stats FOR SELECT USING (true);

-- Create policies for vote insertion (with rate limiting via IP)
CREATE POLICY "Enable vote insertion" ON survey_votes FOR INSERT WITH CHECK (true);
