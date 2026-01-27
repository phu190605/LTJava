-- ================= VOCAB QUESTIONS =================
CREATE TABLE IF NOT EXISTS vocab_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer VARCHAR(255) NOT NULL,
    choices VARCHAR(255),
    topic VARCHAR(100)
);
DELETE FROM vocab_questions;
INSERT INTO vocab_questions (question, answer, choices, topic) VALUES
-- Câu hỏi cho challenge "Khởi động ngày mới"
('What is the synonym of "happy"?', 'joyful', 'joyful,sad,angry,fast', 'vocab'),
('What is the antonym of "hot"?', 'cold', 'warm,cold,wet,soft', 'vocab'),
('Fill in the blank: The cat is ___ the table.', 'on', 'in,on,under,behind', 'vocab'),
('Translate to English: "quả táo"', 'apple', 'apple,banana,orange,grape', 'vocab'),
('What is the plural of "child"?', 'children', 'childs,childes,children,child', 'vocab'),
-- Câu hỏi cho challenge "Chiến binh kiên trì"
('What is the synonym of "fast"?', 'quick', 'quick,slow,late,old', 'Word_2'),
('What is the antonym of "difficult"?', 'easy', 'hard,easy,slow,short', 'Word_2'),
('Fill in the blank: She ___ to school every day.', 'goes', 'goes,go,going,gone', 'Word_2'),
('Translate to English: "con chó"', 'dog', 'dog,cat,mouse,bird', 'Word_2'),
('What is the plural of "person"?', 'people', 'persons,peoples,people,person', 'Word_2');
-- Active: 1768031295604@@127.0.0.1@3307
-- ================= SKILLS =================
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

-- Clear test_questions to avoid duplicates
DELETE FROM test_questions;
INSERT INTO test_questions (type, level, content, answer) VALUES
('read', 'A1', '"Tom has a red ball." What color is Tom''s ball?', 'red'),
('read', 'A2', '"Mary eats breakfast at 7 o''clock." When does Mary eat breakfast?', '7 o''clock'),
('fill', 'A1', 'The sun rises in the ___.', 'east'),
('fill', 'A2', 'Water boils at ___ degrees Celsius.', '100'),
('fill', 'B1', 'The capital of France is ___.', 'paris'),
('fill', 'B2', 'Photosynthesis occurs in the ___ of the plant cell.', 'chloroplast'),
('read', 'B1', '"The teacher explained the lesson clearly." How did the teacher explain the lesson?', 'clearly'),
('read', 'B2', '"Although tired, she finished her homework before midnight." When did she finish her homework?', 'before midnight');

-- ================= LEARNER GOALS =================
INSERT IGNORE INTO learner_goals
(goal_id, goal_name, goal_code, description, icon_url)
VALUES
(1,'Phát triển sự nghiệp','CAREER','Thăng tiến, phỏng vấn, môi trường công sở','/icons/goals/career.png'),
(2,'Hỗ trợ học tập','EDUCATION','Thi chứng chỉ, du học, nghiên cứu tài liệu','/icons/goals/education.png'),
(3,'Chuẩn bị đi du lịch','TRAVEL','Giao tiếp sân bay, khách sạn, hỏi đường','/icons/goals/travel.png'),
(4,'Kết bạn & Giao lưu','SOCIAL','Trò chuyện tự nhiên, hiểu văn hóa','/icons/goals/social.png'),
(5,'Định cư nước ngoài','MIGRATION','Sinh sống và làm việc lâu dài','/icons/goals/migration.png'),
(6,'Sở thích cá nhân','HOBBY','Xem phim, nghe nhạc, học cho vui','/icons/goals/hobby.png');

-- ================= TOPICS =================
INSERT IGNORE INTO topics
(topic_id, topic_name, topic_code, description, icon_url, category)
VALUES
(1,'Nấu ăn & Ẩm thực','COOKING','Công thức món ăn, nhà hàng','/icons/topics/cooking.png','GENERAL'),
(2,'Nhiếp ảnh','PHOTO','Góc chụp, ánh sáng, chỉnh ảnh','/icons/topics/camera.png','GENERAL'),
(3,'Thể thao','SPORTS','Bóng đá, Gym, Yoga','/icons/topics/sports.png','GENERAL'),
(4,'Làm vườn','GARDEN','Cây cảnh, thiên nhiên','/icons/topics/garden.png','GENERAL'),
(5,'Leo núi & Dã ngoại','HIKING','Cắm trại, sinh tồn','/icons/topics/hiking.png','GENERAL'),
(6,'Âm nhạc','MUSIC','Nhạc cụ, ca sĩ, lời bài hát','/icons/topics/music.png','GENERAL'),
(7,'Yoga','YOGA','Thiền, tư thế, sức khỏe','/icons/topics/yoga.png','GENERAL'),
(8,'Gym & Thể hình','FITNESS','Bài tập, dinh dưỡng','/icons/topics/fitness.png','GENERAL'),
(9,'Công nghệ thông tin','TECH','Lập trình, phần mềm, AI','/icons/topics/tech.png','SPECIALIZED'),
(10,'Tài chính & Kinh doanh','FINANCE','Đầu tư, chứng khoán, kế toán','/icons/topics/finance.png','SPECIALIZED');

-- ================= SERVICE PACKAGES (FIXED) =================
 INSERT IGNORE INTO service_packages
 (`package_id`, `package_name`, `has_mentor`, `price`, `duration_months`, `description`, `features`) VALUES 
(1, 'Gói Cơ Bản', 0, 299000.00, 1, 'Cơ bản - 299k/Tháng', '["Truy cập dashboard", "AI Practice không giới hạn", "Chấm điểm phát âm tự động", "Lộ trình cá nhân hóa cơ bản"]'),
(2, 'Gói Chuyên Nghiệp', 1, 599000.00, 1, 'Phổ biến - 599k/Tháng', '["Tất cả tính năng gói Cơ bản", "2 buổi mentor/tháng", "Báo cáo tiến độ chi tiết", "Hỗ trợ ưu tiên"]'),
(3, 'Gói Cao Cấp', 1, 999000.00, 1, 'Cao cấp - 999k/Tháng', '["Tất cả tính năng gói Chuyên nghiệp", "Mentor không giới hạn", "Xuất báo cáo PDF/Excel", "Chứng nhận hoàn thành", "Lộ trình chuyên sâu"]');

-- ================= CHALLENGES =================
-- Xóa bảng con (tiến độ) trước
DELETE FROM user_challenge_progress; -- Xóa tiến độ để tránh vi phạm khóa ngoại
DELETE FROM challenges;
INSERT INTO challenges (title, description, type, target_value, xp_reward)
VALUES
('Khởi động ngày mới', 'Từ Vựng', 'Word_1', 5, 50),
('Chiến binh kiên trì', 'Từ Vựng', 'Word_2', 5, 100);


