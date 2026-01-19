CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);


INSERT IGNORE INTO skills (name) VALUES
('Grammar'),
('IELTS'),
('Listening'),
('Phonetics & IPA'),
('Reading'),
('Speaking'),
('TOEIC'),
('Writing');
