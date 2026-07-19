-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    has_password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- USER ACCOUNT TABLE (1:1 with users)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_account (
    account_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_num VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(12,2) DEFAULT 0
);

-- ============================================================
-- GOAL TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS goal (
    goal_id SERIAL PRIMARY KEY,
    goal_name VARCHAR(255) NOT NULL,
    goal_amount NUMERIC(12,2) NOT NULL,
    goal_term VARCHAR(100),
    total_transact NUMERIC(12,2) DEFAULT 0,
    remaining_amount NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','matured','closed'))
);

-- ============================================================
-- USER TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_transact (
    transact_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES user_account(account_id),
    amount_transacted NUMERIC(12,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL
        CHECK (transaction_type IN ('deposit','withdraw','transfer')),
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    goal_id INT REFERENCES goal(goal_id)
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Prevent withdrawals until goal is matured
CREATE OR REPLACE FUNCTION prevent_withdrawals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_type = 'withdraw' AND NEW.goal_id IS NOT NULL THEN
        IF (SELECT status FROM goal WHERE goal_id = NEW.goal_id) <> 'matured' THEN
            RAISE EXCEPTION 'Withdrawals not allowed until goal is matured.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_withdrawals
BEFORE INSERT ON user_transact
FOR EACH ROW
EXECUTE FUNCTION prevent_withdrawals();

-- Auto-update goal totals on deposits
CREATE OR REPLACE FUNCTION update_goal_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_type = 'deposit' AND NEW.goal_id IS NOT NULL THEN
        UPDATE goal
        SET total_transact = total_transact + NEW.amount_transacted,
            remaining_amount = goal_amount - (total_transact + NEW.amount_transacted)
        WHERE goal_id = NEW.goal_id;

        UPDATE goal
        SET status = 'matured'
        WHERE goal_id = NEW.goal_id AND total_transact >= goal_amount;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_goal_totals
AFTER INSERT ON user_transact
FOR EACH ROW
EXECUTE FUNCTION update_goal_totals();
