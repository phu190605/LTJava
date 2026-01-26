-- ================= STEP 1: BASIC CONFIGURATION =================
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- Ensure Database is UTF-8
ALTER DATABASE aesp CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ================= STEP 2: CLEANUP OLD DATA =================
DELETE FROM sentences;
DELETE FROM users;
DELETE FROM topics;

-- ================= STEP 3: CREATE TOPICS (ENGLISH) =================
INSERT INTO topics (topic_id, topic_name, topic_code, description, icon_url, category) VALUES
(1, 'Cooking & Cuisine', 'COOKING', 'Recipes, restaurant ordering, and dining etiquette.', '/icons/topics/cooking.png', 'GENERAL'),
(2, 'Photography', 'PHOTO', 'Camera angles, lighting, and photo editing.', '/icons/topics/camera.png', 'GENERAL'),
(3, 'Sports', 'SPORTS', 'Soccer, Gym, Yoga, and athletic activities.', '/icons/topics/sports.png', 'GENERAL'),
(4, 'Gardening', 'GARDEN', 'Planting, nature, and taking care of trees.', '/icons/topics/garden.png', 'GENERAL'),
(5, 'Hiking & Outdoors', 'HIKING', 'Camping, survival skills, and nature exploration.', '/icons/topics/hiking.png', 'GENERAL'),
(6, 'Music', 'MUSIC', 'Instruments, singers, lyrics, and melodies.', '/icons/topics/music.png', 'GENERAL'),
(7, 'Yoga', 'YOGA', 'Meditation, poses, and mental health.', '/icons/topics/yoga.png', 'GENERAL'),
(8, 'Gym & Fitness', 'FITNESS', 'Workouts, nutrition, and bodybuilding.', '/icons/topics/fitness.png', 'GENERAL'),
(9, 'Information Technology', 'TECH', 'Programming, software, AI, and hardware.', '/icons/topics/tech.png', 'SPECIALIZED'),
(10, 'Finance & Business', 'FINANCE', 'Investment, stocks, accounting, and markets.', '/icons/topics/finance.png', 'SPECIALIZED');

-- ================= STEP 4: CREATE DEFAULT USER =================
INSERT INTO users (email, password, full_name, role, is_tested) VALUES 
('admin@aesp.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy57vnUeGdCQfW8n797AnYxPK6yS.DVS', 'System Admin', 'ADMIN', 0);

-- ================= STEP 5: CREATE SENTENCES (ENGLISH - ENGLISH) =================

-- --- TOPIC 1: COOKING ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(1, 'Add salt to taste.', 'Add an amount of salt that you prefer.', 'BEGINNER', 'AESP_EXT'),
(1, 'Boil the water.', 'Heat the water until it bubbles.', 'BEGINNER', 'AESP_EXT'),
(1, 'Cut the vegetables.', 'Chop or slice the vegetables.', 'BEGINNER', 'AESP_EXT'),
(1, 'Breakfast is ready.', 'The morning meal is prepared.', 'BEGINNER', 'AESP_EXT'),
(1, 'Do not eat this.', 'Avoid consuming this item.', 'BEGINNER', 'AESP_EXT'),
(1, 'The soup is hot.', 'The soup has a high temperature.', 'BEGINNER', 'AESP_EXT'),
(1, 'I am hungry.', 'I feel the need to eat.', 'BEGINNER', 'AESP_EXT'),
(1, 'Wash your hands.', 'Clean your hands with water and soap.', 'BEGINNER', 'AESP_EXT'),
(1, 'Mix it well.', 'Combine the ingredients thoroughly.', 'BEGINNER', 'AESP_EXT'),
(1, 'This tastes good.', 'This has a pleasant flavor.', 'BEGINNER', 'AESP_EXT'),
(1, 'Preheat the oven to 180 degrees.', 'Warm up the oven to 180 degrees before cooking.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'The recipe calls for olive oil.', 'This dish requires olive oil as an ingredient.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'Knead the dough until smooth.', 'Press and fold the dough until it has a smooth texture.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'Sauté the garlic until golden.', 'Fry the garlic quickly until it turns gold.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'This ingredient is essential.', 'This item is absolutely necessary.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'Avoid overcooking the pasta.', 'Do not cook the pasta for too long.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'Garnish with fresh herbs.', 'Decorate the dish with fresh plants like basil.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'The sauce has a rich flavor.', 'The sauce tastes very strong and delicious.', 'INTERMEDIATE', 'AESP_EXT'),
(1, 'Let the meat rest before slicing.', 'Wait a moment before cutting the meat.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 2: PHOTOGRAPHY ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(2, 'Look at the camera.', 'Direct your eyes towards the lens.', 'BEGINNER', 'AESP_EXT'),
(2, 'Smile, please.', 'Please make a happy face.', 'BEGINNER', 'AESP_EXT'),
(2, 'Use the flash.', 'Turn on the camera light.', 'BEGINNER', 'AESP_EXT'),
(2, 'This photo is dark.', 'There is not enough light in this picture.', 'BEGINNER', 'AESP_EXT'),
(2, 'I like this picture.', 'I enjoy looking at this photo.', 'BEGINNER', 'AESP_EXT'),
(2, 'Don''t move.', 'Stay still.', 'BEGINNER', 'AESP_EXT'),
(2, 'Take a selfie.', 'Take a photo of yourself.', 'BEGINNER', 'AESP_EXT'),
(2, 'Check the battery.', 'See how much power is left.', 'BEGINNER', 'AESP_EXT'),
(2, 'Zoom in a bit.', 'Make the image appear closer.', 'BEGINNER', 'AESP_EXT'),
(2, 'Stand over there.', 'Move to that location.', 'BEGINNER', 'AESP_EXT'),
(2, 'The depth of field is shallow.', 'Only the subject is in focus, the background is blurry.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'Adjust the white balance manually.', 'Set the color temperature by hand.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'Capture the motion clearly.', 'Take the photo without blurring the movement.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'Composition is key to a good shot.', 'How you arrange elements is important.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'Increase the shutter speed.', 'Make the camera take the picture faster.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'Avoid shooting in direct sunlight.', 'Do not take photos under harsh sun.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'The exposure is too high.', 'The image is too bright.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'Use a wide-angle lens here.', 'Use a lens that captures a wider view.', 'INTERMEDIATE', 'AESP_EXT'),
(2, 'Edit the raw files later.', 'Process the uncompressed images afterwards.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 3: SPORTS ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(3, 'Pass the ball.', 'Kick or throw the ball to a teammate.', 'BEGINNER', 'AESP_EXT'),
(3, 'Run faster.', 'Increase your running speed.', 'BEGINNER', 'AESP_EXT'),
(3, 'I like swimming.', 'I enjoy moving through water.', 'BEGINNER', 'AESP_EXT'),
(3, 'Kick the ball.', 'Strike the ball with your foot.', 'BEGINNER', 'AESP_EXT'),
(3, 'We lost the game.', 'We did not win the match.', 'BEGINNER', 'AESP_EXT'),
(3, 'Catch the ball.', 'Grab the ball with your hands.', 'BEGINNER', 'AESP_EXT'),
(3, 'Are you ready?', 'Are you prepared to start?', 'BEGINNER', 'AESP_EXT'),
(3, 'Jump high.', 'Leap into the air.', 'BEGINNER', 'AESP_EXT'),
(3, 'Keep moving.', 'Do not stop.', 'BEGINNER', 'AESP_EXT'),
(3, 'Good job!', 'You did very well!', 'BEGINNER', 'AESP_EXT'),
(3, 'The striker was offside.', 'The attacker was in an illegal position.', 'INTERMEDIATE', 'AESP_EXT'),
(3, 'Their defense strategy is weak.', 'Their plan to protect the goal is not good.', 'INTERMEDIATE', 'AESP_EXT'),
(3, 'He received a yellow card.', 'The referee gave him a warning.', 'INTERMEDIATE', 'AESP_EXT'),
(3, 'We need to improve our stamina.', 'We need to build our endurance.', 'INTERMEDIATE', 'AESP_EXT'),
(3, 'The tournament starts next week.', 'The competition begins in seven days.', 'INTERMEDIATE', 'AESP_EXT'),
(3, 'It was a penalty kick.', 'A free shot at the goal was awarded.', 'INTERMEDIATE', 'AESP_EXT'),
(3, 'Maintain possession of the ball.', 'Keep control of the ball.', 'INTERMEDIATE', 'AESP_EXT'),
(3, 'The coach called a timeout.', 'The trainer asked for a short break.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 4: GARDENING ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(4, 'Dig a hole.', 'Make a hole in the ground.', 'BEGINNER', 'AESP_EXT'),
(4, 'Plant the seeds.', 'Put the seeds into the soil.', 'BEGINNER', 'AESP_EXT'),
(4, 'The sun is hot.', 'The sunlight is very strong.', 'BEGINNER', 'AESP_EXT'),
(4, 'Cut the grass.', 'Trim the lawn.', 'BEGINNER', 'AESP_EXT'),
(4, 'Where is the shovel?', 'I cannot find the digging tool.', 'BEGINNER', 'AESP_EXT'),
(4, 'These flowers are red.', 'The color of these blooms is red.', 'BEGINNER', 'AESP_EXT'),
(4, 'I see a worm.', 'I spot an earthworm.', 'BEGINNER', 'AESP_EXT'),
(4, 'It is raining.', 'Water is falling from the sky.', 'BEGINNER', 'AESP_EXT'),
(4, 'Clean the garden.', 'Remove trash and weeds from the yard.', 'BEGINNER', 'AESP_EXT'),
(4, 'Wear your gloves.', 'Put on protection for your hands.', 'BEGINNER', 'AESP_EXT'),
(4, 'This soil needs more nutrients.', 'The dirt requires more food for plants.', 'INTERMEDIATE', 'AESP_EXT'),
(4, 'Ensure proper drainage for pots.', 'Make sure water can flow out of the containers.', 'INTERMEDIATE', 'AESP_EXT'),
(4, 'Mulching helps retain moisture.', 'Covering the soil keeps it wet.', 'INTERMEDIATE', 'AESP_EXT'),
(4, 'Remove the invasive weeds.', 'Pull out the unwanted plants.', 'INTERMEDIATE', 'AESP_EXT'),
(4, 'Harvest the tomatoes when ripe.', 'Pick the tomatoes when they are ready.', 'INTERMEDIATE', 'AESP_EXT'),
(4, 'This plant requires shade.', 'This plant needs protection from direct sun.', 'INTERMEDIATE', 'AESP_EXT'),
(4, 'Use organic pesticides only.', 'Only use natural bug killers.', 'INTERMEDIATE', 'AESP_EXT'),
(4, 'Repot the plant in spring.', 'Move the plant to a new pot during spring.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 5: HIKING & OUTDOORS ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(5, 'Walk slowly.', 'Do not walk fast.', 'BEGINNER', 'AESP_EXT'),
(5, 'Look at the map.', 'Check the navigation guide.', 'BEGINNER', 'AESP_EXT'),
(5, 'I am tired.', 'I feel exhausted.', 'BEGINNER', 'AESP_EXT'),
(5, 'Drink some water.', 'Hydrate yourself.', 'BEGINNER', 'AESP_EXT'),
(5, 'Follow the trail.', 'Stay on the designated path.', 'BEGINNER', 'AESP_EXT'),
(5, 'Watch your step.', 'Be careful where you walk.', 'BEGINNER', 'AESP_EXT'),
(5, 'Where is the tent?', 'Where is our camping shelter?', 'BEGINNER', 'AESP_EXT'),
(5, 'It is getting dark.', 'The sun is setting.', 'BEGINNER', 'AESP_EXT'),
(5, 'I have a knife.', 'I am carrying a cutting tool.', 'BEGINNER', 'AESP_EXT'),
(5, 'Keep going.', 'Continue moving forward.', 'BEGINNER', 'AESP_EXT'),
(5, 'The altitude makes it hard to breathe.', 'The height makes respiration difficult.', 'INTERMEDIATE', 'AESP_EXT'),
(5, 'We need to start a fire.', 'We must ignite a campfire.', 'INTERMEDIATE', 'AESP_EXT'),
(5, 'Check the weather forecast.', 'Look at the weather prediction.', 'INTERMEDIATE', 'AESP_EXT'),
(5, 'Pack lightweight equipment.', 'Carry gear that is not heavy.', 'INTERMEDIATE', 'AESP_EXT'),
(5, 'Beware of wild animals.', 'Be careful of dangerous wildlife.', 'INTERMEDIATE', 'AESP_EXT'),
(5, 'The terrain is very rocky.', 'The ground is full of stones.', 'INTERMEDIATE', 'AESP_EXT'),
(5, 'Secure the tent pegs firmly.', 'Fasten the tent stakes tightly.', 'INTERMEDIATE', 'AESP_EXT'),
(5, 'This jacket is waterproof.', 'This coat protects against rain.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 6: MUSIC ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(6, 'Sing a song.', 'Perform a vocal melody.', 'BEGINNER', 'AESP_EXT'),
(6, 'Turn up the volume.', 'Make the sound louder.', 'BEGINNER', 'AESP_EXT'),
(6, 'I play the guitar.', 'I can play the guitar instrument.', 'BEGINNER', 'AESP_EXT'),
(6, 'Listen to this.', 'Pay attention to this sound.', 'BEGINNER', 'AESP_EXT'),
(6, 'Do you like jazz?', 'Do you enjoy jazz music?', 'BEGINNER', 'AESP_EXT'),
(6, 'The band is loud.', 'The group plays very noisily.', 'BEGINNER', 'AESP_EXT'),
(6, 'Dance with me.', 'Move your body to the music with me.', 'BEGINNER', 'AESP_EXT'),
(6, 'Stop the music.', 'Turn off the sound.', 'BEGINNER', 'AESP_EXT'),
(6, 'Nice voice.', 'You sing very well.', 'BEGINNER', 'AESP_EXT'),
(6, 'Buy the ticket.', 'Purchase the entry pass.', 'BEGINNER', 'AESP_EXT'),
(6, 'The orchestra performed perfectly.', 'The large group of musicians played flawlessly.', 'INTERMEDIATE', 'AESP_EXT'),
(6, 'The rhythm is very complex.', 'The beat is difficult to follow.', 'INTERMEDIATE', 'AESP_EXT'),
(6, 'She has a wide vocal range.', 'She can sing both high and low notes.', 'INTERMEDIATE', 'AESP_EXT'),
(6, 'The lyrics are deep and poetic.', 'The words of the song are meaningful.', 'INTERMEDIATE', 'AESP_EXT'),
(6, 'He is composing a new symphony.', 'He is writing a new long musical piece.', 'INTERMEDIATE', 'AESP_EXT'),
(6, 'Can you tune my guitar?', 'Can you adjust my guitar strings?', 'INTERMEDIATE', 'AESP_EXT'),
(6, 'The acoustics in here are bad.', 'The sound quality in this room is poor.', 'INTERMEDIATE', 'AESP_EXT'),
(6, 'It is a classic masterpiece.', 'It is a timeless work of art.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 7: YOGA ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(7, 'Close your eyes.', 'Shut your eyes.', 'BEGINNER', 'AESP_EXT'),
(7, 'Hands up.', 'Raise your hands.', 'BEGINNER', 'AESP_EXT'),
(7, 'Sit down slowly.', 'Lower yourself gently.', 'BEGINNER', 'AESP_EXT'),
(7, 'Don''t talk.', 'Stay silent.', 'BEGINNER', 'AESP_EXT'),
(7, 'Feel the stretch.', 'Notice the muscle extension.', 'BEGINNER', 'AESP_EXT'),
(7, 'Stand straight.', 'Stand with good posture.', 'BEGINNER', 'AESP_EXT'),
(7, 'Touch your toes.', 'Reach down to your feet.', 'BEGINNER', 'AESP_EXT'),
(7, 'Breathe in.', 'Inhale air.', 'BEGINNER', 'AESP_EXT'),
(7, 'Look forward.', 'Keep your eyes ahead.', 'BEGINNER', 'AESP_EXT'),
(7, 'Relax your neck.', 'Release tension in your neck.', 'BEGINNER', 'AESP_EXT'),
(7, 'Maintain your balance carefully.', 'Keep yourself steady.', 'INTERMEDIATE', 'AESP_EXT'),
(7, 'Focus on your inner peace.', 'Concentrate on mental calmness.', 'INTERMEDIATE', 'AESP_EXT'),
(7, 'Align your spine correctly.', 'Straighten your back properly.', 'INTERMEDIATE', 'AESP_EXT'),
(7, 'This pose improves flexibility.', 'This position helps you bend easier.', 'INTERMEDIATE', 'AESP_EXT'),
(7, 'Do not strain your muscles.', 'Avoid hurting your muscles.', 'INTERMEDIATE', 'AESP_EXT'),
(7, 'Transition to the next pose.', 'Move smoothly to the next position.', 'INTERMEDIATE', 'AESP_EXT'),
(7, 'Keep your core engaged.', 'Tighten your stomach muscles.', 'INTERMEDIATE', 'AESP_EXT'),
(7, 'Meditation reduces stress levels.', 'Focusing the mind lowers anxiety.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 8: GYM & FITNESS ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(8, 'Lift the weight.', 'Pick up the heavy object.', 'BEGINNER', 'AESP_EXT'),
(8, 'Drink more water.', 'Consume more fluids.', 'BEGINNER', 'AESP_EXT'),
(8, 'I am sweating.', 'My body is releasing water.', 'BEGINNER', 'AESP_EXT'),
(8, 'Run on the treadmill.', 'Jog on the running machine.', 'BEGINNER', 'AESP_EXT'),
(8, 'Do ten pushups.', 'Complete ten press-ups.', 'BEGINNER', 'AESP_EXT'),
(8, 'Rest for a minute.', 'Take a break for 60 seconds.', 'BEGINNER', 'AESP_EXT'),
(8, 'My legs hurt.', 'My legs are in pain.', 'BEGINNER', 'AESP_EXT'),
(8, 'Go to the gym.', 'Visit the fitness center.', 'BEGINNER', 'AESP_EXT'),
(8, 'Eat healthy food.', 'Consume nutritious meals.', 'BEGINNER', 'AESP_EXT'),
(8, 'Stronger everyday.', 'Getting more powerful daily.', 'BEGINNER', 'AESP_EXT'),
(8, 'Focus on your breathing technique.', 'Pay attention to how you breathe.', 'INTERMEDIATE', 'AESP_EXT'),
(8, 'Increase the intensity gradually.', 'Make the workout harder step by step.', 'INTERMEDIATE', 'AESP_EXT'),
(8, 'Supplements can help recovery.', 'Vitamins can aid in healing muscles.', 'INTERMEDIATE', 'AESP_EXT'),
(8, 'Maintain proper form strictly.', 'Keep the correct posture at all times.', 'INTERMEDIATE', 'AESP_EXT'),
(8, 'High intensity interval training.', 'Short bursts of intense exercise.', 'INTERMEDIATE', 'AESP_EXT'),
(8, 'Calculate your daily calories.', 'Count how much energy you consume.', 'INTERMEDIATE', 'AESP_EXT'),
(8, 'Warm up to prevent injury.', 'Exercise lightly to avoid getting hurt.', 'INTERMEDIATE', 'AESP_EXT'),
(8, 'Consistency is the key.', 'Doing it regularly is most important.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 9: IT & TECH ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(9, 'Click the mouse.', 'Press the button on the mouse.', 'BEGINNER', 'AESP_EXT'),
(9, 'Type your password.', 'Enter your secret code.', 'BEGINNER', 'AESP_EXT'),
(9, 'Save the file.', 'Store the document.', 'BEGINNER', 'AESP_EXT'),
(9, 'My screen is black.', 'My monitor is not showing anything.', 'BEGINNER', 'AESP_EXT'),
(9, 'Download the app.', 'Get the application from the internet.', 'BEGINNER', 'AESP_EXT'),
(9, 'Log in now.', 'Sign into your account.', 'BEGINNER', 'AESP_EXT'),
(9, 'Check your email.', 'Look at your electronic mail.', 'BEGINNER', 'AESP_EXT'),
(9, 'The internet is slow.', 'The connection speed is poor.', 'BEGINNER', 'AESP_EXT'),
(9, 'Restart the router.', 'Reboot the network device.', 'BEGINNER', 'AESP_EXT'),
(9, 'Where is the link?', 'Where is the URL address?', 'BEGINNER', 'AESP_EXT'),
(9, 'Deploy the code to production.', 'Release the software to the live server.', 'INTERMEDIATE', 'AESP_EXT'),
(9, 'The algorithm optimizes search results.', 'The code improves how results are found.', 'INTERMEDIATE', 'AESP_EXT'),
(9, 'Backup the database regularly.', 'Save a copy of the data often.', 'INTERMEDIATE', 'AESP_EXT'),
(9, 'Fix the security vulnerability.', 'Repair the safety weakness.', 'INTERMEDIATE', 'AESP_EXT'),
(9, 'Configure the firewall settings.', 'Setup the network protection rules.', 'INTERMEDIATE', 'AESP_EXT'),
(9, 'The system requires authentication.', 'You must verify who you are.', 'INTERMEDIATE', 'AESP_EXT'),
(9, 'Debug the application logic.', 'Find and fix errors in the code.', 'INTERMEDIATE', 'AESP_EXT'),
(9, 'Cloud computing is scalable.', 'Online servers can grow with demand.', 'INTERMEDIATE', 'AESP_EXT');

-- --- TOPIC 10: FINANCE & BUSINESS ---
INSERT INTO sentences (topic_id, content, vietnamese_meaning, level, source) VALUES
(10, 'I need money.', 'I require cash.', 'BEGINNER', 'AESP_EXT'),
(10, 'Pay the bill.', 'Settle the invoice.', 'BEGINNER', 'AESP_EXT'),
(10, 'Is it expensive?', 'Does it cost a lot?', 'BEGINNER', 'AESP_EXT'),
(10, 'Sign the contract.', 'Write your name on the agreement.', 'BEGINNER', 'AESP_EXT'),
(10, 'Save your cash.', 'Keep your money safe.', 'BEGINNER', 'AESP_EXT'),
(10, 'Buy low, sell high.', 'Purchase cheap, sell expensive.', 'BEGINNER', 'AESP_EXT'),
(10, 'Where is the bank?', 'Where is the financial building?', 'BEGINNER', 'AESP_EXT'),
(10, 'I have a job.', 'I have employment.', 'BEGINNER', 'AESP_EXT'),
(10, 'Check the price.', 'Look at the cost.', 'BEGINNER', 'AESP_EXT'),
(10, 'Use the credit card.', 'Pay with plastic money.', 'BEGINNER', 'AESP_EXT'),
(10, 'Diversify your investment portfolio.', 'Spread your money across different assets.', 'INTERMEDIATE', 'AESP_EXT'),
(10, 'The inflation rate increased.', 'The cost of living has gone up.', 'INTERMEDIATE', 'AESP_EXT'),
(10, 'Analyze the quarterly report.', 'Study the three-month business review.', 'INTERMEDIATE', 'AESP_EXT'),
(10, 'Reduce operational expenses.', 'Cut down on running costs.', 'INTERMEDIATE', 'AESP_EXT'),
(10, 'Negotiate the salary package.', 'Discuss your pay and benefits.', 'INTERMEDIATE', 'AESP_EXT'),
(10, 'The market is very competitive.', 'There are many rivals in the business.', 'INTERMEDIATE', 'AESP_EXT'),
(10, 'Transfer funds internationally.', 'Send money to another country.', 'INTERMEDIATE', 'AESP_EXT'),
(10, 'Calculate the return on investment.', 'Figure out the profit from the cost.', 'INTERMEDIATE', 'AESP_EXT');
USE aesp;

-- ================================
-- 1. TOPICS (Sở thích & Chủ đề quan tâm)
-- ================================
INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 1,'Nấu ăn & Ẩm thực','COOKING','Công thức món ăn, nhà hàng','/icons/topics/cooking.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='COOKING');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 2,'Nhiếp ảnh','PHOTO','Góc chụp, ánh sáng, chỉnh ảnh','/icons/topics/camera.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='PHOTO');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 3,'Thể thao','SPORTS','Bóng đá, Gym, Yoga','/icons/topics/sports.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='SPORTS');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 4,'Làm vườn','GARDEN','Cây cảnh, thiên nhiên','/icons/topics/garden.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='GARDEN');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 5,'Leo núi & Dã ngoại','HIKING','Cắm trại, sinh tồn','/icons/topics/hiking.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='HIKING');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 6,'Âm nhạc','MUSIC','Nhạc cụ, ca sĩ, lời bài hát','/icons/topics/music.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='MUSIC');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 7,'Yoga','YOGA','Thiền, tư thế, sức khỏe','/icons/topics/yoga.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='YOGA');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 8,'Gym & Thể hình','FITNESS','Bài tập, dinh dưỡng','/icons/topics/fitness.png','GENERAL'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='FITNESS');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 9,'Công nghệ thông tin','TECH','Lập trình, phần mềm, AI','/icons/topics/tech.png','SPECIALIZED'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='TECH');

INSERT INTO `topics` (`topic_id`, `topic_name`, `topic_code`, `description`, `icon_url`, `category`)
SELECT 10,'Tài chính & Kinh doanh','FINANCE','Đầu tư, chứng khoán, kế toán','/icons/topics/finance.png','SPECIALIZED'
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE topic_code='FINANCE');


-- ================================
-- 2. TEST QUESTIONS (Câu hỏi kiểm tra trình độ)
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
-- 3. LEARNER GOALS (Mục tiêu học tập)
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
-- 4. SERVICE PACKAGES (Gói cước dịch vụ)
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
-- 5. CHALLENGES (Thử thách hàng ngày)
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
