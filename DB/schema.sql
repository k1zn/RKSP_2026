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

-- Представления

CREATE OR REPLACE VIEW v_trees_full AS
SELECT
    t.id,
    t.health_status,
    t.plant_date,
    t.notes,
    s.latin_name,
    s.common_name,
    s.family,
    s.max_height_m,
    l.name    AS location_name,
    l.address AS location_address,
    l.area_ha
FROM trees t
JOIN species s ON s.id = t.species_id
LEFT JOIN locations l ON l.id = t.location_id;

CREATE OR REPLACE VIEW v_location_stats AS
SELECT
    l.id,
    l.name,
    l.address,
    l.area_ha,
    COUNT(t.id)                                             AS total_trees,
    COUNT(DISTINCT t.species_id)                            AS distinct_species,
    COUNT(t.id) FILTER (WHERE t.health_status = 'healthy') AS healthy_count,
    COUNT(t.id) FILTER (WHERE t.health_status = 'ill')     AS ill_count,
    COUNT(t.id) FILTER (WHERE t.health_status = 'dead')    AS dead_count
FROM locations l
LEFT JOIN trees t ON t.location_id = l.id
GROUP BY l.id, l.name, l.address, l.area_ha;

CREATE OR REPLACE VIEW v_species_health AS
SELECT
    s.id,
    s.common_name,
    s.latin_name,
    COUNT(t.id)                                             AS total_trees,
    COUNT(t.id) FILTER (WHERE t.health_status = 'healthy') AS healthy,
    COUNT(t.id) FILTER (WHERE t.health_status = 'ill')     AS ill,
    COUNT(t.id) FILTER (WHERE t.health_status = 'dead')    AS dead
FROM species s
LEFT JOIN trees t ON t.species_id = s.id
GROUP BY s.id, s.common_name, s.latin_name;

-- Функции

CREATE OR REPLACE FUNCTION get_trees_by_health(p_status TEXT)
RETURNS TABLE (
    tree_id     INTEGER,
    common_name VARCHAR,
    latin_name  VARCHAR,
    location    VARCHAR,
    plant_date  DATE
)
LANGUAGE plpgsql AS $$
BEGIN
    IF p_status NOT IN ('healthy', 'ill', 'dead') THEN
        RAISE EXCEPTION 'Неверный статус: %. Допустимые значения: healthy, ill, dead', p_status;
    END IF;
    RETURN QUERY
        SELECT t.id, s.common_name, s.latin_name, l.name, t.plant_date
        FROM trees t
        JOIN species s ON s.id = t.species_id
        LEFT JOIN locations l ON l.id = t.location_id
        WHERE t.health_status = p_status
        ORDER BY t.id;
END;
$$;

CREATE OR REPLACE FUNCTION count_trees_in_location(p_location_id INTEGER)
RETURNS BIGINT
LANGUAGE sql AS $$
    SELECT COUNT(*) FROM trees WHERE location_id = p_location_id;
$$;

CREATE OR REPLACE FUNCTION species_exists(p_latin_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql AS $$
    SELECT EXISTS (SELECT 1 FROM species WHERE latin_name = p_latin_name);
$$;

-- Хранимые процедуры

CREATE OR REPLACE PROCEDURE seed_sample_data()
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO species (latin_name, common_name, family, description, max_height_m) VALUES
        ('Quercus robur', 'Дуб черешчатый', 'Fagaceae', 'Мощное листопадное дерево, долгожитель.', 40),
        ('Betula pendula', 'Берёза повислая', 'Betulaceae', 'Светолюбивое дерево с белой корой.', 25),
        ('Pinus sylvestris', 'Сосна обыкновенная', 'Pinaceae', 'Хвойное дерево таёжных лесов.', 35)
    ON CONFLICT (latin_name) DO NOTHING;

    INSERT INTO locations (name, address, area_ha, description) VALUES
        ('Центральный парк', 'ул. Ленина, 1', 12.5, 'Исторический городской парк.'),
        ('Дендропарк «Рощица»', 'Лесной проспект, 44', 35.0, 'Специализированный дендрологический парк.')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Тестовые данные добавлены';
END;
$$;

CREATE OR REPLACE PROCEDURE update_tree_health(p_tree_id INTEGER, p_status TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    IF p_status NOT IN ('healthy', 'ill', 'dead') THEN
        RAISE EXCEPTION 'Неверный статус: %', p_status;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM trees WHERE id = p_tree_id) THEN
        RAISE EXCEPTION 'Дерево с id=% не найдено', p_tree_id;
    END IF;
    UPDATE trees SET health_status = p_status WHERE id = p_tree_id;
END;
$$;

CREATE OR REPLACE PROCEDURE remove_dead_trees(p_location_id INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM trees WHERE location_id = p_location_id AND health_status = 'dead';
    DELETE FROM trees WHERE location_id = p_location_id AND health_status = 'dead';
    RAISE NOTICE 'Удалено % погибших деревьев из локации %', v_count, p_location_id;
END;
$$;

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
