-- Дендрарий — схема базы данных

-- Таблицы

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    age           INTEGER CHECK (age >= 0 AND age <= 150),
    role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guest')),
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS species (
    id            SERIAL PRIMARY KEY,
    latin_name    VARCHAR(200) NOT NULL UNIQUE,
    common_name   VARCHAR(200) NOT NULL,
    family        VARCHAR(100),
    description   TEXT,
    max_height_m  FLOAT CHECK (max_height_m >= 0),
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    address     VARCHAR(300),
    area_ha     FLOAT CHECK (area_ha >= 0),
    description TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trees (
    id            SERIAL PRIMARY KEY,
    species_id    INTEGER NOT NULL REFERENCES species(id) ON DELETE RESTRICT,
    location_id   INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    plant_date    DATE,
    health_status VARCHAR(20) NOT NULL DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'ill', 'dead')),
    notes         TEXT,
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_audit_log (
    id         SERIAL PRIMARY KEY,
    tree_id    INTEGER NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Триггеры

CREATE OR REPLACE FUNCTION trg_fn_audit_health()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.health_status IS DISTINCT FROM NEW.health_status THEN
        INSERT INTO health_audit_log (tree_id, old_status, new_status)
        VALUES (NEW.id, OLD.health_status, NEW.health_status);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_health ON trees;
CREATE TRIGGER trg_audit_health
    AFTER UPDATE ON trees
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_audit_health();

CREATE OR REPLACE FUNCTION trg_fn_prevent_species_delete()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM trees WHERE species_id = OLD.id;
    IF v_count > 0 THEN
        RAISE EXCEPTION 'Невозможно удалить вид "%": существует % дерев(а/ьев) этого вида', OLD.common_name, v_count;
    END IF;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_species_delete ON species;
CREATE TRIGGER trg_prevent_species_delete
    BEFORE DELETE ON species
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_prevent_species_delete();

CREATE OR REPLACE FUNCTION trg_fn_default_plant_date()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.plant_date IS NULL THEN
        NEW.plant_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_default_plant_date ON trees;
CREATE TRIGGER trg_default_plant_date
    BEFORE INSERT ON trees
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_default_plant_date();

-- Начальный администратор (пароль: admin123)
INSERT INTO users (name, email, age, role, password_hash) VALUES
    ('Администратор', 'admin@dendrary.ru', 30, 'admin',
     '$2a$10$kZ9uK3vqN8wX5pL7mR4jOe8nHqT2cY6iA1bE0sW3dF5gJ9lM7nP2K')
ON CONFLICT (email) DO NOTHING;
