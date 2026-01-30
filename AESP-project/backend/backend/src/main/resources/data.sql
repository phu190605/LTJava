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

UPDATE mentor_skills ms
JOIN skills s ON ms.skill_id = s.id
SET ms.skill = s.name
WHERE ms.skill_id IS NOT NULL;

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
INSERT IGNORE INTO test_questions (type, level, content, answer) VALUES
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
(4,'Kết bạn & Giao lưu','SOCIAL','Trò chuyện tự nhiên, hiểu văn hóa','/icons/goals/social.png');


-- ================= TOPICS =================

INSERT INTO topics (topic_id, topic_name, topic_code, description, icon_url, category) VALUES
(1, 'Nấu ăn', 'COOKING', 'Ẩm thực, công thức món ăn', '/icons/topics/cooking.png', 'GENERAL'),
(2, 'Thể thao', 'SPORTS', 'Bóng đá, Gym, vận động', '/icons/topics/sports.png', 'GENERAL'),
(3, 'Âm nhạc', 'MUSIC', 'Ca hát, nhạc cụ, giải trí', '/icons/topics/music.png', 'GENERAL'),
(4, 'Công nghệ', 'TECH', 'Lập trình, AI, máy tính', '/icons/topics/tech.png', 'SPECIALIZED');

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

-- ================= SYSTEM POLICY =================
CREATE TABLE IF NOT EXISTS system_policy (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- TERMS, PRIVACY
    content TEXT NOT NULL,
    version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

DELETE FROM system_policy;

INSERT INTO system_policy (type, content, version, is_active)
VALUES (
'TERMS',
'
ĐIỀU KHOẢN SỬ DỤNG – AESP

Chào mừng bạn đến với AESP – English Speaking Platform.
Khi sử dụng hệ thống, bạn đồng ý tuân thủ các điều khoản sau.

1. Mục đích sử dụng
AESP cung cấp nền tảng học và luyện nói tiếng Anh thông qua AI, mentor và các công cụ hỗ trợ học tập.
Người dùng chỉ được sử dụng hệ thống cho mục đích học tập hợp pháp.

2. Tài khoản người dùng
- Mỗi người dùng chỉ được tạo một tài khoản.
- Người dùng chịu trách nhiệm bảo mật thông tin đăng nhập.
- AESP có quyền khóa tài khoản nếu phát hiện hành vi gian lận hoặc lạm dụng.

3. Nội dung và quyền sở hữu
Toàn bộ nội dung trên hệ thống (bài học, câu hỏi, phản hồi AI, thiết kế)
thuộc quyền sở hữu của AESP hoặc đối tác liên quan.

4. Mentor và tương tác
Người dùng phải giữ thái độ tôn trọng trong quá trình trao đổi với mentor.
AESP có quyền ghi nhận và xử lý các hành vi vi phạm quy tắc cộng đồng.

5. Thanh toán và gói dịch vụ
Các gói dịch vụ có thời hạn rõ ràng.
Phí đã thanh toán sẽ không được hoàn lại trừ khi có thông báo khác từ AESP.

6. Thay đổi điều khoản
AESP có quyền cập nhật điều khoản sử dụng.
Phiên bản mới sẽ có hiệu lực ngay khi được công bố trên hệ thống.

Việc tiếp tục sử dụng AESP đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với các điều khoản trên.
',
'v1.0',
true
);

-- ================= PRIVACY =================
INSERT INTO system_policy (type, content, version, is_active)
VALUES (
'PRIVACY',
'
CHÍNH SÁCH BẢO MẬT – AESP

AESP cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng.

1. Thông tin được thu thập
- Email và tên hiển thị
- Dữ liệu học tập, tiến độ và kết quả luyện tập
- Nội dung luyện nói và phản hồi từ AI

2. Mục đích sử dụng dữ liệu
- Cá nhân hóa lộ trình học tập
- Kết nối người học với mentor
- Nâng cao chất lượng dịch vụ và hệ thống

3. Bảo mật thông tin
Dữ liệu người dùng được lưu trữ an toàn
và chỉ được truy cập bởi hệ thống hoặc nhân sự có thẩm quyền.

4. Chia sẻ dữ liệu
AESP không chia sẻ thông tin cá nhân cho bên thứ ba
ngoại trừ trường hợp có yêu cầu từ cơ quan pháp luật.

5. Quyền của người dùng
- Xem và cập nhật thông tin cá nhân
- Yêu cầu xóa tài khoản
- Liên hệ hỗ trợ khi có vấn đề liên quan đến dữ liệu

6. Cập nhật chính sách
Chính sách bảo mật có thể được cập nhật để phù hợp với quy định và dịch vụ mới.

AESP luôn đặt quyền riêng tư của người dùng lên hàng đầu.
',
'v1.0',
true
);
INSERT INTO learning_path_vocab_questions (level, goal_code, topic_code, question) VALUES
-- === B1 Questions ===
-- CAREER / COOKING
('B1', 'CAREER', 'COOKING', 'This restaurant is famous for its delicious cuisine.'),
('B1', 'CAREER', 'COOKING', 'The head chef created a new recipe for the menu.'),
('B1', 'CAREER', 'COOKING', 'Everything on the table looks absolutely delicious.'),
('B1', 'CAREER', 'COOKING', 'Please read the recipe carefully before you start.'),
('B1', 'CAREER', 'COOKING', 'You should sample the sauce to check the flavor.'),

-- CAREER / SPORTS
('B1', 'CAREER', 'SPORTS', 'She trained hard to become the world champion.'),
('B1', 'CAREER', 'SPORTS', 'The athlete broke the world record yesterday.'),
('B1', 'CAREER', 'SPORTS', 'They celebrated their victory with a big party.'),
('B1', 'CAREER', 'SPORTS', 'The team displayed their trophies in the hall.'),
('B1', 'CAREER', 'SPORTS', 'He decided to enlist in the local football club.'),

-- CAREER / MUSIC
('B1', 'CAREER', 'MUSIC', 'The orchestra performed a beautiful symphony.'),
('B1', 'CAREER', 'MUSIC', 'The musician performed live on stage last night.'),
('B1', 'CAREER', 'MUSIC', 'This song is written in a major key.'),
('B1', 'CAREER', 'MUSIC', 'Beethoven wrote nine famous symphonies.'),
('B1', 'CAREER', 'MUSIC', 'They like to jam together in the garage on weekends.'),

-- CAREER / TECH
('B1', 'CAREER', 'TECH', 'All the information is stored in the database.'),
('B1', 'CAREER', 'TECH', 'The developer built a secure application.'),
('B1', 'CAREER', 'TECH', 'It takes time to upload large video files.'),
('B1', 'CAREER', 'TECH', 'We need to upgrade our servers to handle the traffic.'),
('B1', 'CAREER', 'TECH', 'You should refactor the code to make it cleaner.'),

-- EDUCATION / COOKING
('B1', 'EDUCATION', 'COOKING', 'This soup has a very unique flavor.'),
('B1', 'EDUCATION', 'COOKING', 'She enrolled in a culinary course to learn cooking.'),
('B1', 'EDUCATION', 'COOKING', 'Eating vegetables is very healthy for you.'),
('B1', 'EDUCATION', 'COOKING', 'There are three bakeries on this street.'),
('B1', 'EDUCATION', 'COOKING', 'Please chop the onions into small pieces.'),

-- EDUCATION / SPORTS
('B1', 'EDUCATION', 'SPORTS', 'The fitness instructor showed us how to exercise.'),
('B1', 'EDUCATION', 'SPORTS', 'He earned a gold medal for his performance.'),
('B1', 'EDUCATION', 'SPORTS', 'This course is perfect for a beginner.'),
('B1', 'EDUCATION', 'SPORTS', 'School activities help students make new friends.'),
('B1', 'EDUCATION', 'SPORTS', 'Always do a warmup before you start running.'),

-- EDUCATION / MUSIC
('B1', 'EDUCATION', 'MUSIC', 'I have a piano lesson every Tuesday afternoon.'),
('B1', 'EDUCATION', 'MUSIC', 'She memorized the lyrics to her favorite song.'),
('B1', 'EDUCATION', 'MUSIC', 'He prefers playing an acoustic guitar.'),
('B1', 'EDUCATION', 'MUSIC', 'The melodies of these songs are very catchy.'),
('B1', 'EDUCATION', 'MUSIC', 'The teacher will conduct the school choir.'),

-- EDUCATION / TECH
('B1', 'EDUCATION', 'TECH', 'This new gadget makes daily tasks easier.'),
('B1', 'EDUCATION', 'TECH', 'He installed the antivirus software on his laptop.'),
('B1', 'EDUCATION', 'TECH', 'We attended a virtual meeting via Zoom.'),
('B1', 'EDUCATION', 'TECH', 'Modern technology has changed education completely.'),
('B1', 'EDUCATION', 'TECH', 'Students use the internet to research their topics.'),

-- TRAVEL / COOKING
('B1', 'TRAVEL', 'COOKING', 'We love trying regional food when we travel.'),
('B1', 'TRAVEL', 'COOKING', 'We tasted the local specialty at the market.'),
('B1', 'TRAVEL', 'COOKING', 'I cannot eat spicy food, I prefer it mild.'),
('B1', 'TRAVEL', 'COOKING', 'Seafood is a delicacy in this coastal town.'),
('B1', 'TRAVEL', 'COOKING', 'Please reserve a table for two at 7 PM.'),

-- TRAVEL / SPORTS
('B1', 'TRAVEL', 'SPORTS', 'Our trip to the mountains was a great adventure.'),
('B1', 'TRAVEL', 'SPORTS', 'They rented skis and boots for the day.'),
('B1', 'TRAVEL', 'SPORTS', 'We enjoy outdoor activities like hiking and camping.'),
('B1', 'TRAVEL', 'SPORTS', 'The journey to the island took four hours.'),
('B1', 'TRAVEL', 'SPORTS', 'We plan to hike to the top of the hill.'),

-- TRAVEL / MUSIC
('B1', 'TRAVEL', 'MUSIC', 'The summer music festival is a big event.'),
('B1', 'TRAVEL', 'MUSIC', 'Thousands of people attended the rock concert.'),
('B1', 'TRAVEL', 'MUSIC', 'This airport handles many international flights.'),
('B1', 'TRAVEL', 'MUSIC', 'The band gave amazing performances in three cities.'),
('B1', 'TRAVEL', 'MUSIC', 'They are going to tour Europe next summer.'),

-- TRAVEL / TECH
('B1', 'TRAVEL', 'TECH', 'The internet connection here is very stable.'),
('B1', 'TRAVEL', 'TECH', 'I successfully connected to the hotel Wi-Fi.'),
('B1', 'TRAVEL', 'TECH', 'Most cafes offer free wireless internet access.'),
('B1', 'TRAVEL', 'TECH', 'Make sure to pack extra batteries for your camera.'),
('B1', 'TRAVEL', 'TECH', 'We used GPS to locate the nearest gas station.'),

-- SOCIAL / COOKING
('B1', 'SOCIAL', 'COOKING', 'We are having a small gathering this weekend.'),
('B1', 'SOCIAL', 'COOKING', 'She hosted a wonderful dinner party for us.'),
('B1', 'SOCIAL', 'COOKING', 'It is a casual dinner, so you can wear jeans.'),
('B1', 'SOCIAL', 'COOKING', 'I sent out the invitations for my birthday.'),
('B1', 'SOCIAL', 'COOKING', 'Everyone should contribute a dish to the potluck.'),

-- SOCIAL / SPORTS
('B1', 'SOCIAL', 'SPORTS', 'He shook hands with his opponent after the match.'),
('B1', 'SOCIAL', 'SPORTS', 'Teams from all over the country competed today.'),
('B1', 'SOCIAL', 'SPORTS', 'It is important to play fair and respect others.'),
('B1', 'SOCIAL', 'SPORTS', 'There were over fifty competitors in the race.'),
('B1', 'SOCIAL', 'SPORTS', 'The crowd tried to motivate the tired players.'),

-- SOCIAL / MUSIC
('B1', 'SOCIAL', 'MUSIC', 'The audience clapped loudly after the song.'),
('B1', 'SOCIAL', 'MUSIC', 'We all sang "Happy Birthday" to him.'),
('B1', 'SOCIAL', 'MUSIC', 'She started her solo career last year.'),
('B1', 'SOCIAL', 'MUSIC', 'The chorus of the song is very easy to remember.'),
('B1', 'SOCIAL', 'MUSIC', 'Parties are a great place to socialize with people.'),

-- SOCIAL / TECH
('B1', 'SOCIAL', 'TECH', 'Facebook is a popular social media platform.'),
('B1', 'SOCIAL', 'TECH', 'She updated her profile picture yesterday.'),
('B1', 'SOCIAL', 'TECH', 'I had to unfriend him because he was rude.'),
('B1', 'SOCIAL', 'TECH', 'Online communities can be very supportive.'),
('B1', 'SOCIAL', 'TECH', 'We can stream the movie directly to the TV.'),

-- === B2 Questions ===
('B2', 'CAREER', 'COOKING', 'This restaurant serves excellent gourmet food.'),
('B2', 'CAREER', 'COOKING', 'The critic praised the chef for his creativity.'),
('B2', 'CAREER', 'COOKING', 'The meal looked very appetizing on the plate.'),
('B2', 'CAREER', 'COOKING', 'Top chefs work very long hours in the kitchen.'),
('B2', 'CAREER', 'COOKING', 'Use fresh mint leaves to garnish the dessert.'),

('B2', 'CAREER', 'SPORTS', 'His rival is also training for the gold medal.'),
('B2', 'CAREER', 'SPORTS', 'They secured their place in the finals.'),
('B2', 'CAREER', 'SPORTS', 'A good defense is as important as a good offense.'),
('B2', 'CAREER', 'SPORTS', 'The coaches met to discuss the game plan.'),
('B2', 'CAREER', 'SPORTS', 'You need to hone your skills every day.'),

('B2', 'CAREER', 'MUSIC', 'She plays violin in a string ensemble.'),
('B2', 'CAREER', 'MUSIC', 'The band released their new album last week.'),
('B2', 'CAREER', 'MUSIC', 'The singers sang in perfect harmony.'),
('B2', 'CAREER', 'MUSIC', 'I have all of their albums on my phone.'),
('B2', 'CAREER', 'MUSIC', 'Jazz musicians often improvise during solos.'),

('B2', 'CAREER', 'TECH', 'The search engine uses a complex algorithm.'),
('B2', 'CAREER', 'TECH', 'Engineers designed a more efficient system.'),
('B2', 'CAREER', 'TECH', 'Please check the data input carefully.'),
('B2', 'CAREER', 'TECH', 'We need detailed analyses of the user data.'),
('B2', 'CAREER', 'TECH', 'The system will validate your password automatically.'),

('B2', 'EDUCATION', 'COOKING', 'Good nutrition is essential for a healthy body.'),
('B2', 'EDUCATION', 'COOKING', 'Students must observe the kitchen safety rules.'),
('B2', 'EDUCATION', 'COOKING', 'The recipe was too complex for the beginners.'),
('B2', 'EDUCATION', 'COOKING', 'The professor handed out the course syllabi.'),
('B2', 'EDUCATION', 'COOKING', 'You should marinate the chicken for two hours.'),

('B2', 'EDUCATION', 'SPORTS', 'The team discussed their strategy before the game.'),
('B2', 'EDUCATION', 'SPORTS', 'The teacher evaluated the student''s progress.'),
('B2', 'EDUCATION', 'SPORTS', 'She is a fully qualified swimming instructor.'),
('B2', 'EDUCATION', 'SPORTS', 'We will watch a series of training videos.'),
('B2', 'EDUCATION', 'SPORTS', 'Martial arts require a lot of discipline.'),

('B2', 'EDUCATION', 'MUSIC', 'He played a classical composition on the piano.'),
('B2', 'EDUCATION', 'MUSIC', 'The pianist interpreted the piece with emotion.'),
('B2', 'EDUCATION', 'MUSIC', 'Modern music sometimes uses dissonance for effect.'),
('B2', 'EDUCATION', 'MUSIC', 'There are two guitar solos in this song.'),
('B2', 'EDUCATION', 'MUSIC', 'We had to analyze the song structure in class.'),

('B2', 'EDUCATION', 'TECH', 'The smartphone was a major technological innovation.'),
('B2', 'EDUCATION', 'TECH', 'They developed a new way to share files.'),
('B2', 'EDUCATION', 'TECH', 'Many people prefer digital books over paper ones.'),
('B2', 'EDUCATION', 'TECH', 'What are the criteria for passing the exam?'),
('B2', 'EDUCATION', 'TECH', 'We plan to implement the changes next month.'),

('B2', 'TRAVEL', 'COOKING', 'We want to eat authentic Italian pizza.'),
('B2', 'TRAVEL', 'COOKING', 'We sampled several types of cheese at the farm.'),
('B2', 'TRAVEL', 'COOKING', 'They sell exotic fruits from South America.'),
('B2', 'TRAVEL', 'COOKING', 'These pastries are local specialties.'),
('B2', 'TRAVEL', 'COOKING', 'We decided to indulge in a luxurious dinner.'),

('B2', 'TRAVEL', 'SPORTS', 'They went on an expedition to the North Pole.'),
('B2', 'TRAVEL', 'SPORTS', 'The guide navigated through the dense forest.'),
('B2', 'TRAVEL', 'SPORTS', 'The village is located in a remote area.'),
('B2', 'TRAVEL', 'SPORTS', 'Compasses are useful for finding direction.'),
('B2', 'TRAVEL', 'SPORTS', 'We plan to trek across the mountains.'),

('B2', 'TRAVEL', 'MUSIC', 'Folk music is part of our cultural heritage.'),
('B2', 'TRAVEL', 'MUSIC', 'The gallery showcased art from local artists.'),
('B2', 'TRAVEL', 'MUSIC', 'The museum features contemporary art exhibitions.'),
('B2', 'TRAVEL', 'MUSIC', 'Two cellos played the opening notes.'),
('B2', 'TRAVEL', 'MUSIC', 'Travel helps us appreciate different cultures.'),

('B2', 'TRAVEL', 'TECH', 'He lives like a digital nomad, working from cafes.'),
('B2', 'TRAVEL', 'TECH', 'The application translated the sign instantly.'),
('B2', 'TRAVEL', 'TECH', 'This portable charger is great for traveling.'),
('B2', 'TRAVEL', 'TECH', 'Refer to the indices at the back of the book.'),
('B2', 'TRAVEL', 'TECH', 'Don''t forget to synchronize your phone data.'),

('B2', 'SOCIAL', 'COOKING', 'Thank you for your warm hospitality.'),
('B2', 'SOCIAL', 'COOKING', 'We entertained our guests with music and food.'),
('B2', 'SOCIAL', 'COOKING', 'It is polite to say thank you after the meal.'),
('B2', 'SOCIAL', 'COOKING', 'Please tell the waiter if you have any allergies.'),
('B2', 'SOCIAL', 'COOKING', 'Can you recommend a good dessert?'),

('B2', 'SOCIAL', 'SPORTS', 'Team sports build a sense of camaraderie.'),
('B2', 'SOCIAL', 'SPORTS', 'We collaborated with another team for the event.'),
('B2', 'SOCIAL', 'SPORTS', 'The fans were united in their support.'),
('B2', 'SOCIAL', 'SPORTS', 'He has won several tennis tournaments.'),
('B2', 'SOCIAL', 'SPORTS', 'Everyone is encouraged to participate in the game.'),

('B2', 'SOCIAL', 'MUSIC', 'The soft lighting created a relaxing ambiance.'),
('B2', 'SOCIAL', 'MUSIC', 'The audience applauded enthusiastically.'),
('B2', 'SOCIAL', 'MUSIC', 'The band gave a very energetic performance.'),
('B2', 'SOCIAL', 'MUSIC', 'She enjoys listening to various music genres.'),
('B2', 'SOCIAL', 'MUSIC', 'Guests began to mingle after the ceremony.'),

('B2', 'SOCIAL', 'TECH', 'Social media has a big influence on teenagers.'),
('B2', 'SOCIAL', 'TECH', 'The viral video generated millions of views.'),
('B2', 'SOCIAL', 'TECH', 'Public Wi-Fi networks are not always secure.'),
('B2', 'SOCIAL', 'TECH', 'Television is a powerful medium of communication.'),
('B2', 'SOCIAL', 'TECH', 'Users can interact with the app using voice.'),

-- === A2 Questions ===
('A2', 'CAREER', 'COOKING', 'Flour is a main ingredient in bread.'),
('A2', 'CAREER', 'COOKING', 'He washes the vegetables before cutting them.'),
('A2', 'CAREER', 'COOKING', 'This fish tastes very fresh.'),
('A2', 'CAREER', 'COOKING', 'Who will wash the dirty dishes?'),
('A2', 'CAREER', 'COOKING', 'Heat the oil in the pan first.'),

('A2', 'CAREER', 'SPORTS', 'The referee blew the whistle to stop the game.'),
('A2', 'CAREER', 'SPORTS', 'Our team won the final match.'),
('A2', 'CAREER', 'SPORTS', 'He tries to stay active by running every day.'),
('A2', 'CAREER', 'SPORTS', 'The football stadium was full of people.'),
('A2', 'CAREER', 'SPORTS', 'I need to practice my tennis serve.'),

('A2', 'CAREER', 'MUSIC', 'Mozart was a very famous composer.'),
('A2', 'CAREER', 'MUSIC', 'She plays the piano beautifully.'),
('A2', 'CAREER', 'MUSIC', 'That note sounded a bit sharp.'),
('A2', 'CAREER', 'MUSIC', 'There are two violins in the band.'),
('A2', 'CAREER', 'MUSIC', 'He wants to compose a song for his wife.'),

('A2', 'CAREER', 'TECH', 'The computer network is down today.'),
('A2', 'CAREER', 'TECH', 'She uses her tablet for drawing.'),
('A2', 'CAREER', 'TECH', 'I cannot connect to the internet.'),
('A2', 'CAREER', 'TECH', 'Please save your files before closing.'),
('A2', 'CAREER', 'TECH', 'It took hours to debug the program.'),

('A2', 'EDUCATION', 'COOKING', 'Follow the recipe step by step.'),
('A2', 'EDUCATION', 'COOKING', 'We learned how to make pasta today.'),
('A2', 'EDUCATION', 'COOKING', 'This cake tastes absolutely delicious.'),
('A2', 'EDUCATION', 'COOKING', 'Peel the potatoes before boiling them.'),
('A2', 'EDUCATION', 'COOKING', 'Taste the soup and add salt if needed.'),

('A2', 'EDUCATION', 'SPORTS', 'We have PE class in the gym.'),
('A2', 'EDUCATION', 'SPORTS', 'The coach explained the rules clearly.'),
('A2', 'EDUCATION', 'SPORTS', 'He runs very fast.'),
('A2', 'EDUCATION', 'SPORTS', 'There are thirty students in my class.'),
('A2', 'EDUCATION', 'SPORTS', 'I want to improve my swimming skills.'),

('A2', 'EDUCATION', 'MUSIC', 'The melody is stuck in my head.'),
('A2', 'EDUCATION', 'MUSIC', 'We sang songs around the campfire.'),
('A2', 'EDUCATION', 'MUSIC', 'Please be quiet in the library.'),
('A2', 'EDUCATION', 'MUSIC', 'We have a pop quiz in history today.'),
('A2', 'EDUCATION', 'MUSIC', 'Could you repeat the question please?'),

('A2', 'EDUCATION', 'TECH', 'I forgot my laptop charger at home.'),
('A2', 'EDUCATION', 'TECH', 'She submitted her assignment online.'),
('A2', 'EDUCATION', 'TECH', 'Don''t forget to save your work.'),
('A2', 'EDUCATION', 'TECH', 'Do not share your passwords with anyone.'),
('A2', 'EDUCATION', 'TECH', 'Click the link to open the website.'),

('A2', 'TRAVEL', 'COOKING', 'The street food here is very tasty.'),
('A2', 'TRAVEL', 'COOKING', 'We tried sushi for the first time.'),
('A2', 'TRAVEL', 'COOKING', 'Food in this city is quite expensive.'),
('A2', 'TRAVEL', 'COOKING', 'Let''s buy some sandwiches for lunch.'),
('A2', 'TRAVEL', 'COOKING', 'Can you recommend a good restaurant?'),

('A2', 'TRAVEL', 'SPORTS', 'We are planning a trip to the beach.'),
('A2', 'TRAVEL', 'SPORTS', 'They climbed to the top of the tower.'),
('A2', 'TRAVEL', 'SPORTS', 'Is it safe to swim here?'),
('A2', 'TRAVEL', 'SPORTS', 'The tour guides were very friendly.'),
('A2', 'TRAVEL', 'SPORTS', 'We want to explore the old city.'),

('A2', 'TRAVEL', 'MUSIC', 'The talent show starts at 8 PM.'),
('A2', 'TRAVEL', 'MUSIC', 'The jazz band played all night.'),
('A2', 'TRAVEL', 'MUSIC', 'The hotel has a modern design.'),
('A2', 'TRAVEL', 'MUSIC', 'We bought tickets for the concert.'),
('A2', 'TRAVEL', 'MUSIC', 'The band will tour across Asia.'),

('A2', 'TRAVEL', 'TECH', 'I use a map on my phone.'),
('A2', 'TRAVEL', 'TECH', 'I booked a flight to London.'),
('A2', 'TRAVEL', 'TECH', 'The departure time is 10 AM.'),
('A2', 'TRAVEL', 'TECH', 'He took many photos with his camera.'),
('A2', 'TRAVEL', 'TECH', 'It is hard to navigate this city.'),

('A2', 'SOCIAL', 'COOKING', 'What are we having for dinner?'),
('A2', 'SOCIAL', 'COOKING', 'She baked cookies for the party.'),
('A2', 'SOCIAL', 'COOKING', 'I am full, I cannot eat anymore.'),
('A2', 'SOCIAL', 'COOKING', 'Can I have a glass of water?'),
('A2', 'SOCIAL', 'COOKING', 'Did you invite him to the party?'),

('A2', 'SOCIAL', 'SPORTS', 'He went fishing with his buddy.'),
('A2', 'SOCIAL', 'SPORTS', 'We played video games all day.'),
('A2', 'SOCIAL', 'SPORTS', 'I hate to lose a game.'),
('A2', 'SOCIAL', 'SPORTS', 'Reading is one of my hobbies.'),
('A2', 'SOCIAL', 'SPORTS', 'The fans cheer for their team.'),

('A2', 'SOCIAL', 'MUSIC', 'They formed a rock group in school.'),
('A2', 'SOCIAL', 'MUSIC', 'We danced until midnight.'),
('A2', 'SOCIAL', 'MUSIC', 'He wants to be a famous singer.'),
('A2', 'SOCIAL', 'MUSIC', 'We are going to birthday parties.'),
('A2', 'SOCIAL', 'MUSIC', 'It is nice to share your toys.'),

('A2', 'SOCIAL', 'TECH', 'Let''s have a chat later.'),
('A2', 'SOCIAL', 'TECH', 'She posted a new status update.'),
('A2', 'SOCIAL', 'TECH', 'Please reply to my email.'),
('A2', 'SOCIAL', 'TECH', 'We watched funny videos online.'),
('A2', 'SOCIAL', 'TECH', 'Click here to join the meeting.'),

-- === A1 Questions ===
('A1', 'CAREER', 'COOKING', 'Do not eat raw meat.'),
('A1', 'CAREER', 'COOKING', 'Be careful with that sharp knife.'),
('A1', 'CAREER', 'COOKING', 'My father likes to cook dinner.'),
('A1', 'CAREER', 'COOKING', 'The chefs are wearing white hats.'),
('A1', 'CAREER', 'COOKING', 'I need to wash my hands.'),

('A1', 'CAREER', 'SPORTS', 'Did you win or lose?'),
('A1', 'CAREER', 'SPORTS', 'The players are on the field.'),
('A1', 'CAREER', 'SPORTS', 'They compete for the prize.'),
('A1', 'CAREER', 'SPORTS', 'Throw the ball to me.'),
('A1', 'CAREER', 'SPORTS', 'He scored a goal.'),

('A1', 'CAREER', 'MUSIC', 'The music is too loud.'),
('A1', 'CAREER', 'MUSIC', 'Pianos are heavy instruments.'),
('A1', 'CAREER', 'MUSIC', 'She wants to compose a song.'),
('A1', 'CAREER', 'MUSIC', 'I love listening to these songs.'),
('A1', 'CAREER', 'MUSIC', 'They record music in a studio.'),

('A1', 'CAREER', 'TECH', 'I can read this book offline.'),
('A1', 'CAREER', 'TECH', 'Click the left button on the mouse.'),
('A1', 'CAREER', 'TECH', 'He learns to program in Python.'),
('A1', 'CAREER', 'TECH', 'We have two computers at home.'),
('A1', 'CAREER', 'TECH', 'They want to build a robot.'),

('A1', 'EDUCATION', 'COOKING', 'This candy is very sweet.'),
('A1', 'EDUCATION', 'COOKING', 'I like red tomatoes.'),
('A1', 'EDUCATION', 'COOKING', 'Stir the coffee with a spoon.'),
('A1', 'EDUCATION', 'COOKING', 'She eats apples every day.'),
('A1', 'EDUCATION', 'COOKING', 'Boil the water for tea.'),

('A1', 'EDUCATION', 'SPORTS', 'He is very strong.'),
('A1', 'EDUCATION', 'SPORTS', 'The coaches help us learn.'),
('A1', 'EDUCATION', 'SPORTS', 'Can you sprint to the finish line?'),
('A1', 'EDUCATION', 'SPORTS', 'We play games at recess.'),
('A1', 'EDUCATION', 'SPORTS', 'Practice makes perfect.'),

('A1', 'EDUCATION', 'MUSIC', 'That sound is too high.'),
('A1', 'EDUCATION', 'MUSIC', 'Write down the musical notes.'),
('A1', 'EDUCATION', 'MUSIC', 'The students perform on stage.'),
('A1', 'EDUCATION', 'MUSIC', 'Listen to your teachers.'),
('A1', 'EDUCATION', 'MUSIC', 'I study music at school.'),

('A1', 'EDUCATION', 'TECH', 'This homework is easy.'),
('A1', 'EDUCATION', 'TECH', 'The screen is bright.'),
('A1', 'EDUCATION', 'TECH', 'Do you know how to operate this?'),
('A1', 'EDUCATION', 'TECH', 'Type on the keyboard.'),
('A1', 'EDUCATION', 'TECH', 'I study English online.'),

('A1', 'TRAVEL', 'COOKING', 'The soup is very hot.'),
('A1', 'TRAVEL', 'COOKING', 'Can I see the menu?'),
('A1', 'TRAVEL', 'COOKING', 'We dine at 7 PM.'),
('A1', 'TRAVEL', 'COOKING', 'There are many cafes here.'),
('A1', 'TRAVEL', 'COOKING', 'I would like to order pizza.'),

('A1', 'TRAVEL', 'SPORTS', 'Let''s start the game.'),
('A1', 'TRAVEL', 'SPORTS', 'We watched two matches.'),
('A1', 'TRAVEL', 'SPORTS', 'Crowds spectate the event.'),
('A1', 'TRAVEL', 'SPORTS', 'Here is my train ticket.'),
('A1', 'TRAVEL', 'SPORTS', 'We visit the park often.'),

('A1', 'TRAVEL', 'MUSIC', 'This is an old song.'),
('A1', 'TRAVEL', 'MUSIC', 'We go to concerts together.'),
('A1', 'TRAVEL', 'MUSIC', 'Enjoy the show!'),
('A1', 'TRAVEL', 'MUSIC', 'Summer festivals are fun.'),
('A1', 'TRAVEL', 'MUSIC', 'Listen to the birds.'),

('A1', 'TRAVEL', 'TECH', 'Open the door please.'),
('A1', 'TRAVEL', 'TECH', 'Turn off your electronic devices.'),
('A1', 'TRAVEL', 'TECH', 'I browse the web for news.'),
('A1', 'TRAVEL', 'TECH', 'Where are our phones?'),
('A1', 'TRAVEL', 'TECH', 'Did you find your keys?'),

('A1', 'SOCIAL', 'COOKING', 'We can cook together.'),
('A1', 'SOCIAL', 'COOKING', 'I have many friends.'),
('A1', 'SOCIAL', 'COOKING', 'Share your food.'),
('A1', 'SOCIAL', 'COOKING', 'The guests are here.'),
('A1', 'SOCIAL', 'COOKING', 'They serve lunch at noon.'),

('A1', 'SOCIAL', 'SPORTS', 'She is my best friend.'),
('A1', 'SOCIAL', 'SPORTS', 'The two teams are ready.'),
('A1', 'SOCIAL', 'SPORTS', 'We must cooperate to win.'),
('A1', 'SOCIAL', 'SPORTS', 'The fans are shouting.'),
('A1', 'SOCIAL', 'SPORTS', 'I support my local team.'),

('A1', 'SOCIAL', 'MUSIC', 'I feel happy today.'),
('A1', 'SOCIAL', 'MUSIC', 'The bands played well.'),
('A1', 'SOCIAL', 'MUSIC', 'Join the chorus.'),
('A1', 'SOCIAL', 'MUSIC', 'The singers are on stage.'),
('A1', 'SOCIAL', 'MUSIC', 'Do you like to dance?'),

('A1', 'SOCIAL', 'TECH', 'This is a public park.'),
('A1', 'SOCIAL', 'TECH', 'I have new messages.'),
('A1', 'SOCIAL', 'TECH', 'We chat every day.'),
('A1', 'SOCIAL', 'TECH', 'Show me your photos.'),
('A1', 'SOCIAL', 'TECH', 'Send me the link.');

