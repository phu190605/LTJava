-- Active: 1767324086435@@127.0.0.1@3306@aesp
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

INSERT INTO test_questions (type, level, content, answer) VALUES
('read', 'A1', '"Tom has a red ball." What color is Tom''s ball?', 'red'),
('read', 'A2', '"Mary eats breakfast at 7 o''clock." When does Mary eat breakfast?', '7 o''clock'),
('fill', 'A1', 'The sun rises in the ___.', 'east'),
('fill', 'A2', 'Water boils at ___ degrees Celsius.', '100'),
('fill', 'B1', 'The capital of France is ___.', 'paris'),
('fill', 'B2', 'Photosynthesis occurs in the ___ of the plant cell.', 'chloroplast'),
('read', 'B1', '"The teacher explained the lesson clearly." How did the teacher explain the lesson?', 'clearly'),
('read', 'B2', '"Although tired, she finished her homework before midnight." When did she finish her homework?', 'before midnight');



-- 1. Bảng Learner Goals (Mục tiêu học tập)
INSERT IGNORE INTO `learner_goals` (`goal_id`, `goal_name`, `goal_code`, `description`, `icon_url`) VALUES 
(1,'Phát triển sự nghiệp','CAREER','Thăng tiến, phỏng vấn, môi trường công sở','/icons/goals/career.png'),
(2,'Hỗ trợ học tập','EDUCATION','Thi chứng chỉ, du học, nghiên cứu tài liệu','/icons/goals/education.png'),
(3,'Chuẩn bị đi du lịch','TRAVEL','Giao tiếp sân bay, khách sạn, hỏi đường','/icons/goals/travel.png'),
(4,'Kết bạn & Giao lưu','SOCIAL','Trò chuyện tự nhiên, hiểu văn hóa','/icons/goals/social.png'),
(5,'Định cư nước ngoài','MIGRATION','Sinh sống và làm việc lâu dài','/icons/goals/migration.png'),
(6,'Sở thích cá nhân','HOBBY','Xem phim, nghe nhạc, học cho vui','/icons/goals/hobby.png');

-- 2. Bảng Topics (Chủ đề)
INSERT IGNORE INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`) VALUES 
(1,'Nấu ăn & Ẩm thực','COOKING','Công thức món ăn, nhà hàng','/icons/topics/cooking.png','GENERAL'),
(2,'Nhiếp ảnh','PHOTO','Góc chụp, ánh sáng, chỉnh ảnh','/icons/topics/camera.png','GENERAL'),
(3,'Thể thao','SPORTS','Bóng đá, Gym, Yoga','/icons/topics/sports.png','GENERAL'),(4,'Làm vườn','GARDEN','Cây cảnh, thiên nhiên','/icons/topics/garden.png','GENERAL'),(5,'Leo núi & Dã ngoại','HIKING','Cắm trại, sinh tồn','/icons/topics/hiking.png','GENERAL'),(6,'Âm nhạc','MUSIC','Nhạc cụ, ca sĩ, lời bài hát','/icons/topics/music.png','GENERAL'),(7,'Yoga','YOGA','Thiền, tư thế, sức khỏe','/icons/topics/yoga.png','GENERAL'),(8,'Gym & Thể hình','FITNESS','Bài tập, dinh dưỡng','/icons/topics/fitness.png','GENERAL'),(9,'Công nghệ thông tin','TECH','Lập trình, phần mềm, AI','/icons/topics/tech.png','SPECIALIZED'),(10,'Tài chính & Kinh doanh','FINANCE','Đầu tư, chứng khoán, kế toán','/icons/topics/finance.png','SPECIALIZED');

-- 3. Bảng Service Packages (Gói cước)
INSERT INTO service_packages (`package_id`, `package_name`, `has_mentor`, `price`, `duration_months`, `description`, `features`) VALUES 
(1,'Gói Cơ Bản',0,299000.00,1,'Cơ bản - 299k/Tháng','[\"Truy cập dashboard\", \"AI Practice không giới hạn\", \"Chấm điểm phát âm tự động\", \"Lộ trình cá nhân hóa cơ bản\"]'),
(2,'Gói Chuyên Nghiệp',1,599000.00,1,'Phổ biến - 599k/Tháng','[\"Tất cả tính năng gói Cơ bản\", \"2 buổi mentor/tháng\", \"Báo cáo tiến độ chi tiết\", \"Hỗ trợ ưu tiên\"]'),
(3,'Gói Cao Cấp',1,999000.00,1,'Cao cấp - 999k/Tháng','[\"Tất cả tính năng gói Chuyên nghiệp\", \"Mentor không giới hạn\", \"Xuất báo cáo PDF/Excel\", \"Chứng nhận hoàn thành\", \"Lộ trình chuyên sâu\"]');

-- Nhiệm vụ 1: Dành cho người mới (Nói 5 phút)
INSERT INTO challenges (title, description, type, target_value, xp_reward) 
VALUES ('Khởi động ngày mới', 'Luyện nói đủ 5 phút để làm nóng cơ miệng', 'SPEAKING_TIME', 5, 20);

-- Nhiệm vụ 2: Dành cho người chăm chỉ (Nói 15 phút)
INSERT INTO challenges (title, description, type, target_value, xp_reward) 
VALUES ('Chiến binh kiên trì', 'Hoàn thành 15 phút luyện nói trong ngày', 'SPEAKING_TIME', 15, 50);

-- Nhiệm vụ 3: Thử thách chất lượng (Điểm số trên 80)
INSERT INTO challenges (title, description, type, target_value, xp_reward) 
VALUES ('Phát âm chuẩn chỉnh', 'Đạt điểm đánh giá AI trên 80 điểm trong một bài học', 'ACCURACY_SCORE', 80, 30);

-- Nhiệm vụ 4: Hoàn thành bài học (Số lượng)
INSERT INTO challenges (title, description, type, target_value, xp_reward) 
VALUES ('Học bá', 'Hoàn thành 3 bài học bất kỳ', 'LESSON_COUNT', 3, 40);
