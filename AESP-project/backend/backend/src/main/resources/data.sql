USE aesp;

-- ================================
-- 1. TEST QUESTIONS
-- ================================

INSERT INTO test_questions (type, level, content, answer)
SELECT 'read','A1','"Tom has a red ball." What color is Tom''s ball?','red'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='"Tom has a red ball." What color is Tom''s ball?');

INSERT INTO test_questions (type, level, content, answer)
SELECT 'read','A2','"Mary eats breakfast at 7 o''clock." When does Mary eat breakfast?','7 o''clock'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='"Mary eats breakfast at 7 o''clock." When does Mary eat breakfast?');

INSERT INTO test_questions (type, level, content, answer)
SELECT 'fill','A1','The sun rises in the ___.','east'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='The sun rises in the ___.');

INSERT INTO test_questions (type, level, content, answer)
SELECT 'fill','A2','Water boils at ___ degrees Celsius.','100'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='Water boils at ___ degrees Celsius.');

INSERT INTO test_questions (type, level, content, answer)
SELECT 'fill','B1','The capital of France is ___.','paris'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='The capital of France is ___.');

INSERT INTO test_questions (type, level, content, answer)
SELECT 'fill','B2','Photosynthesis occurs in the ___ of the plant cell.','chloroplast'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='Photosynthesis occurs in the ___ of the plant cell.');

INSERT INTO test_questions (type, level, content, answer)
SELECT 'read','B1','"The teacher explained the lesson clearly." How did the teacher explain the lesson?','clearly'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='"The teacher explained the lesson clearly." How did the teacher explain the lesson?');

INSERT INTO test_questions (type, level, content, answer)
SELECT 'read','B2','"Although tired, she finished her homework before midnight." When did she finish her homework?','before midnight'
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE content='"Although tired, she finished her homework before midnight." When did she finish her homework?');



-- ================================
-- 2. LEARNER GOALS
-- ================================

INSERT INTO learner_goals (goal_id, goal_name, goal_code, description, icon_url)
SELECT 1,'Phát triển sự nghiệp','CAREER','Thăng tiến, phỏng vấn, môi trường công sở','/icons/goals/career.png'
WHERE NOT EXISTS (SELECT 1 FROM learner_goals WHERE goal_code='CAREER');

INSERT INTO learner_goals (goal_id, goal_name, goal_code, description, icon_url)
SELECT 2,'Hỗ trợ học tập','EDUCATION','Thi chứng chỉ, du học, nghiên cứu tài liệu','/icons/goals/education.png'
WHERE NOT EXISTS (SELECT 1 FROM learner_goals WHERE goal_code='EDUCATION');

INSERT INTO learner_goals (goal_id, goal_name, goal_code, description, icon_url)
SELECT 3,'Chuẩn bị đi du lịch','TRAVEL','Giao tiếp sân bay, khách sạn, hỏi đường','/icons/goals/travel.png'
WHERE NOT EXISTS (SELECT 1 FROM learner_goals WHERE goal_code='TRAVEL');

INSERT INTO learner_goals (goal_id, goal_name, goal_code, description, icon_url)
SELECT 4,'Kết bạn & Giao lưu','SOCIAL','Trò chuyện tự nhiên, hiểu văn hóa','/icons/goals/social.png'
WHERE NOT EXISTS (SELECT 1 FROM learner_goals WHERE goal_code='SOCIAL');

INSERT INTO learner_goals (goal_id, goal_name, goal_code, description, icon_url)
SELECT 5,'Định cư nước ngoài','MIGRATION','Sinh sống và làm việc lâu dài','/icons/goals/migration.png'
WHERE NOT EXISTS (SELECT 1 FROM learner_goals WHERE goal_code='MIGRATION');

INSERT INTO learner_goals (goal_id, goal_name, goal_code, description, icon_url)
SELECT 6,'Sở thích cá nhân','HOBBY','Xem phim, nghe nhạc, học cho vui','/icons/goals/hobby.png'
WHERE NOT EXISTS (SELECT 1 FROM learner_goals WHERE goal_code='HOBBY');



-- ================================
-- 3. TOPICS
-- ================================

INSERT INTO topics (topic_id, topic_name, topic_code, description, icon_url, category)
SELECT 1,'Nấu ăn & Ẩm thực','COOKING','Công thức món ăn, nhà hàng','/icons/topics/cooking.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='COOKING');

INSERT INTO topics (topic_id, topic_name, topic_code, description, icon_url, category)
SELECT 2,'Nhiếp ảnh','PHOTO','Góc chụp, ánh sáng, chỉnh ảnh','/icons/topics/camera.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='PHOTO');

INSERT INTO topics (topic_id, topic_name, topic_code, description, icon_url, category)
SELECT 3,'Thể thao','SPORTS','Bóng đá, Gym, Yoga','/icons/topics/sports.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='SPORTS');

INSERT INTO topics (topic_id, topic_name, topic_code, description, icon_url, category)
SELECT 9,'Công nghệ thông tin','TECH','Lập trình, phần mềm, AI','/icons/topics/tech.png','SPECIALIZED'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='TECH');

INSERT INTO topics (topic_id, topic_name, topic_code, description, icon_url, category)
SELECT 10,'Tài chính & Kinh doanh','FINANCE','Đầu tư, chứng khoán, kế toán','/icons/topics/finance.png','SPECIALIZED'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='FINANCE');



-- ================================
-- 4. SERVICE PACKAGES
-- ================================

INSERT INTO service_packages (package_id, package_name, has_mentor, price, duration_months, description, features)
SELECT 1,'Gói Cơ Bản',0,299000,1,'Cơ bản - 299k/Tháng',
'["Truy cập dashboard","AI Practice không giới hạn","Chấm điểm phát âm tự động","Lộ trình cá nhân hóa cơ bản"]'
WHERE NOT EXISTS (SELECT 1 FROM service_packages WHERE package_id=1);

INSERT INTO service_packages (package_id, package_name, has_mentor, price, duration_months, description, features)
SELECT 2,'Gói Chuyên Nghiệp',1,599000,1,'Phổ biến - 599k/Tháng',
'["Tất cả tính năng gói Cơ bản","2 buổi mentor/tháng","Báo cáo tiến độ chi tiết","Hỗ trợ ưu tiên"]'
WHERE NOT EXISTS (SELECT 1 FROM service_packages WHERE package_id=2);

INSERT INTO service_packages (package_id, package_name, has_mentor, price, duration_months, description, features)
SELECT 3,'Gói Cao Cấp',1,999000,1,'Cao cấp - 999k/Tháng',
'["Mentor không giới hạn","Xuất báo cáo","Chứng nhận","Lộ trình chuyên sâu"]'
WHERE NOT EXISTS (SELECT 1 FROM service_packages WHERE package_id=3);



-- ================================
-- 5. CHALLENGES
-- ================================

INSERT INTO challenges (title, description, type, target_value, xp_reward)
SELECT 'Khởi động ngày mới','Luyện nói đủ 5 phút để làm nóng cơ miệng','SPEAKING_TIME',5,20
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE title='Khởi động ngày mới');

INSERT INTO challenges (title, description, type, target_value, xp_reward)
SELECT 'Chiến binh kiên trì','Hoàn thành 15 phút luyện nói trong ngày','SPEAKING_TIME',15,50
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE title='Chiến binh kiên trì');

INSERT INTO challenges (title, description, type, target_value, xp_reward)
SELECT 'Phát âm chuẩn chỉnh','Đạt điểm đánh giá AI trên 80','ACCURACY_SCORE',80,30
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE title='Phát âm chuẩn chỉnh');

INSERT INTO challenges (title, description, type, target_value, xp_reward)
SELECT 'Học bá','Hoàn thành 3 bài học','LESSON_COUNT',3,40
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE title='Học bá');
