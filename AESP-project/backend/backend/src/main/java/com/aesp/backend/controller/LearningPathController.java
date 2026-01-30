package com.aesp.backend.controller;

import com.aesp.backend.dto.request.LearningPathRequest;
import com.aesp.backend.dto.request.VocabQuestionScoreRequest;
import com.aesp.backend.dto.request.EnrollLearningPathRequest;
import com.aesp.backend.dto.request.respone.LearningPathResponse;
import com.aesp.backend.entity.LearningPath;
import com.aesp.backend.entity.UserLearningPath;
import com.aesp.backend.entity.LearningPathVocabQuestion;
import com.aesp.backend.service.LearningPathService;
import com.aesp.backend.service.VocabQuestionService;
import com.aesp.backend.security.JwtUtils;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.repository.UserLearningPathRepository;
import com.aesp.backend.repository.LearningPathVocabQuestionRepository;
import com.aesp.backend.entity.User;
import com.aesp.backend.entity.LearnerProfile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning-path")
@CrossOrigin("*")
public class LearningPathController {

    @Autowired
    private LearningPathService pathService;

    @Autowired
    private VocabQuestionService vocabQuestionService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserLearningPathRepository userLearningPathRepo;
    
    @Autowired
    private LearnerProfileRepository learnerProfileRepository;
    
    @Autowired
    private LearningPathVocabQuestionRepository vocabQuestionRepo;

    /**
     * GET /api/learning-path/my-path
     * Lấy learning path của user hiện tại (đã được enroll)
     * ⚠️ PHẢI ĐẶT TRƯỚC /by-level/{level} để tránh conflict
     */
    @GetMapping("/my-path")
    public ResponseEntity<?> getMyLearningPath(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            System.out.println("🔍 /my-path endpoint called");
            System.out.println("📌 Token: " + (token != null ? "present" : "null"));
            
            // Extract token
            if (token == null || token.isEmpty()) {
                System.out.println("❌ Token is empty or null");
                return ResponseEntity.badRequest().body("Token không hợp lệ");
            }
            
            if (!token.startsWith("Bearer ")) {
                System.out.println("❌ Token không bắt đầu bằng 'Bearer '");
                return ResponseEntity.badRequest().body("Token không hợp lệ");
            }
            
            String jwtToken = token.substring(7);
            System.out.println("🔐 Extracting email from JWT token...");
            String email = jwtUtils.getEmailFromToken(jwtToken);

            if (email == null) {
                System.out.println("❌ email is null from JWT");
                return ResponseEntity.badRequest().body("Không tìm thấy email từ token");
            }

            System.out.println("✅ email from token: " + email);

            // Get user by email
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("❌ User not found in database with email: " + email);
                return ResponseEntity.badRequest().body("Không tìm thấy user");
            }

            System.out.println("✅ User found: " + userOpt.get().getId());

            // Get user's enrolled learning paths (get the first active one)
            System.out.println("📍 Querying IN_PROGRESS paths...");
            List<UserLearningPath> userPaths = userLearningPathRepo.findByUserAndStatus(userOpt.get(), "IN_PROGRESS");
            
            if (userPaths.isEmpty()) {
                System.out.println("⚠️ No IN_PROGRESS paths, getting all paths...");
                // If no IN_PROGRESS path, get any path enrolled
                userPaths = userLearningPathRepo.findByUser(userOpt.get());
            }

            if (userPaths.isEmpty()) {
                System.out.println("⚠️ User has no enrolled learning paths");
                return ResponseEntity.ok(null); // No learning path enrolled
            }

            System.out.println("✅ Found " + userPaths.size() + " learning path(s)");

            // Return first learning path
            UserLearningPath userPath = userPaths.get(0);
            LearningPath path = userPath.getLearningPath();
            
            System.out.println("✅ Learning path: " + path.getPathId() + " - " + path.getDescription());
            
            // ===== LẤY LEVEL HIỆN TẠI TỪ LEARNER PROFILE =====
            String displayLevel = path.getLevel();
            Optional<LearnerProfile> profileOpt = learnerProfileRepository.findByUser_Id(userOpt.get().getId());
            if (profileOpt.isPresent() && profileOpt.get().getCurrentLevelCode() != null) {
                displayLevel = profileOpt.get().getCurrentLevelCode();
                System.out.println("📊 Using learner's current level from profile: " + displayLevel);
            }
            
            // Create response with path details + enrollment info
            var response = new java.util.HashMap<>();
            response.put("pathId", path.getPathId());
            response.put("level", displayLevel);
            response.put("goalCode", path.getGoalCode());
            response.put("topicCode", path.getTopicCode());
            response.put("description", path.getDescription());
            response.put("createdAt", path.getCreatedAt());
            response.put("updatedAt", path.getUpdatedAt());
            response.put("enrollmentId", userPath.getId());
            response.put("progress", userPath.getProgress());
            response.put("status", userPath.getStatus());
            response.put("startedAt", userPath.getStartedAt());

            System.out.println("✅ Returning response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Exception in /my-path: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * POST /api/learning-path/enroll
     * Enroll user vào learning path theo level, goal, topic
     * Body: { "level": "A1", "goalCode": "CAREER", "topicCode": "COOKING" }
     */
    @PostMapping("/enroll")
    public ResponseEntity<?> enrollLearningPath(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody EnrollLearningPathRequest request) {
        try {
            System.out.println("📝 /enroll endpoint called");
            System.out.println("🎯 Request: " + request);
            
            // Extract token
            if (token == null || token.isEmpty() || !token.startsWith("Bearer ")) {
                System.out.println("❌ Token không hợp lệ");
                return ResponseEntity.badRequest().body("Token không hợp lệ");
            }
            
            String jwtToken = token.substring(7);
            String email = jwtUtils.getEmailFromToken(jwtToken);
            
            if (email == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy email từ token");
            }
            
            // Get user
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Không tìm thấy user");
            }
            
            User user = userOpt.get();
            System.out.println("✅ User found: " + user.getId());
            
            // Find learning path
            Optional<LearningPath> pathOpt = pathService.getLearningPathByLevelGoalTopic(
                request.getLevel(),
                request.getGoalCode(),
                request.getTopicCode()
            );
            
            LearningPath path;
            if (pathOpt.isEmpty()) {
                System.out.println("⚠️ Learning path not found, creating default path");
                LearningPathRequest createReq = new LearningPathRequest();
                createReq.setLevel(request.getLevel());
                createReq.setGoalCode(request.getGoalCode());
                createReq.setTopicCode(request.getTopicCode());
                createReq.setDescription("Lộ trình " + request.getLevel() + " - " + request.getGoalCode() + " - " + request.getTopicCode());
                path = pathService.createLearningPath(createReq);
            } else {
                path = pathOpt.get();
            }
            System.out.println("✅ Learning path found: " + path.getPathId());
            
            // Check if already enrolled
            Optional<UserLearningPath> existingEnrollment = userLearningPathRepo.findByUserAndLearningPath_PathId(user, path.getPathId());
            if (existingEnrollment.isPresent()) {
                System.out.println("⚠️ User already enrolled in this path");
                UserLearningPath existing = existingEnrollment.get();
                var response = new java.util.HashMap<>();
                response.put("message", "Người dùng đã đăng ký lộ trình này");
                response.put("enrollmentId", existing.getId());
                response.put("status", existing.getStatus());
                response.put("progress", existing.getProgress());
                return ResponseEntity.ok(response);
            }
            
            // Create new enrollment
            UserLearningPath enrollment = new UserLearningPath();
            enrollment.setUser(user);
            enrollment.setLearningPath(path);
            enrollment.setProgress(0);
            enrollment.setStatus("IN_PROGRESS");
            enrollment.setStartedAt(LocalDateTime.now());
            enrollment.setCreatedAt(LocalDateTime.now());
            enrollment.setUpdatedAt(LocalDateTime.now());
            
            UserLearningPath saved = userLearningPathRepo.save(enrollment);
            System.out.println("✅ Enrollment created: " + saved.getId());
            
            // Build response
            var response = new java.util.HashMap<>();
            response.put("message", "Đăng ký lộ trình thành công");
            response.put("enrollmentId", saved.getId());
            response.put("pathId", path.getPathId());
            response.put("level", path.getLevel());
            response.put("goalCode", path.getGoalCode());
            response.put("topicCode", path.getTopicCode());
            response.put("status", saved.getStatus());
            response.put("progress", saved.getProgress());
            response.put("startedAt", saved.getStartedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error in /enroll: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * GET /api/learning-path/{pathId}/content
     * Lấy nội dung (vocabulary & questions) của learning path
     */
    @GetMapping("/{pathId}/content")
    public ResponseEntity<?> getPathContent(@PathVariable Long pathId) {
        try {
            System.out.println("📚 /content endpoint called for pathId: " + pathId);
            
            // Get learning path
            Optional<LearningPath> pathOpt = pathService.getLearningPathById(pathId);
            if (pathOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Không tìm thấy lộ trình");
            }
            
            LearningPath path = pathOpt.get();
            System.out.println("✅ Found path: " + path.getLevel() + " / " + path.getGoalCode() + " / " + path.getTopicCode());
            
            // Get vocab questions for this path
            List<LearningPathVocabQuestion> questions = vocabQuestionRepo.findByLevelAndGoalCodeAndTopicCode(
                path.getLevel(),
                path.getGoalCode(),
                path.getTopicCode()
            );
            
            System.out.println("✅ Found " + questions.size() + " vocab questions");
            
            // Create response
            var response = new java.util.HashMap<>();
            response.put("pathId", path.getPathId());
            response.put("level", path.getLevel());
            response.put("goalCode", path.getGoalCode());
            response.put("topicCode", path.getTopicCode());
            response.put("description", path.getDescription());
            response.put("totalQuestions", questions.size());
            response.put("questions", questions.stream().map(q -> {
                var qObj = new java.util.HashMap<>();
                qObj.put("id", q.getId());
                qObj.put("question", q.getQuestion());
                qObj.put("answer", q.getAnswer());
                qObj.put("choices", q.getChoices() != null ? q.getChoices().split(",") : new String[]{});
                return qObj;
            }).toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Exception in /content: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * POST /api/learning-path/create
     * Tạo learning path mới
     */
    @PostMapping("/create")
    public ResponseEntity<?> createLearningPath(@RequestBody LearningPathRequest request) {
        try {
            LearningPath path = pathService.createLearningPath(request);
            LearningPathResponse response = pathService.convertToResponse(path);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo lộ trình: " + e.getMessage());
        }
    }

    /**
     * GET /api/learning-path/{pathId}
     * Lấy learning path theo ID
     */
    @GetMapping("/{pathId}")
    public ResponseEntity<?> getLearningPathById(@PathVariable Long pathId) {
        try {
            Optional<LearningPath> pathOpt = pathService.getLearningPathById(pathId);
            if (pathOpt.isPresent()) {
                LearningPathResponse response = pathService.convertToResponse(pathOpt.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * GET /api/learning-path/by-level/{level}
     * Lấy learning paths theo level
     */
    @GetMapping("/by-level/{level}")
    public ResponseEntity<?> getLearningPathsByLevel(@PathVariable String level) {
        try {
            List<LearningPath> paths = pathService.getLearningPathsByLevel(level);
            return ResponseEntity.ok(paths.stream()
                    .map(p -> pathService.convertToResponse(p))
                    .toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * GET /api/learning-path/by-goal/{goalCode}
     * Lấy learning paths theo goal code
     */
    @GetMapping("/by-goal/{goalCode}")
    public ResponseEntity<?> getLearningPathsByGoalCode(@PathVariable String goalCode) {
        try {
            List<LearningPath> paths = pathService.getLearningPathsByGoalCode(goalCode);
            return ResponseEntity.ok(paths.stream()
                    .map(p -> pathService.convertToResponse(p))
                    .toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * GET /api/learning-path/by-topic/{topicCode}
     * Lấy learning paths theo topic code
     */
    @GetMapping("/by-topic/{topicCode}")
    public ResponseEntity<?> getLearningPathsByTopicCode(@PathVariable String topicCode) {
        try {
            List<LearningPath> paths = pathService.getLearningPathsByTopicCode(topicCode);
            return ResponseEntity.ok(paths.stream()
                    .map(p -> pathService.convertToResponse(p))
                    .toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * GET /api/learning-path/search
     * Tìm kiếm learning path theo level, goal code, topic code
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchLearningPath(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String goalCode,
            @RequestParam(required = false) String topicCode
    ) {
        try {
            if (level != null && goalCode != null && topicCode != null) {
                Optional<LearningPath> path = pathService.getLearningPathByLevelGoalTopic(level, goalCode, topicCode);
                if (path.isPresent()) {
                    return ResponseEntity.ok(pathService.convertToResponse(path.get()));
                } else {
                    return ResponseEntity.notFound().build();
                }
            }
            return ResponseEntity.badRequest().body("Cần cung cấp level, goalCode, và topicCode");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * POST /api/learning-path/submit-question-score
     * Submit a vocab question answer with score (Reuses SpeakingTestService logic)
     */
    @PostMapping("/submit-question-score")
    public ResponseEntity<?> submitQuestionScore(@RequestBody VocabQuestionScoreRequest request) {
        try {
            System.out.println("🎤 /submit-question-score endpoint called");
            System.out.println("📝 Question ID: " + request.getQuestionId() + ", Score: " + request.getScore());
            
            Map<String, Object> response = vocabQuestionService.submitQuestionScore(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error in /submit-question-score: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body("Lỗi lưu điểm: " + e.getMessage());
        }
    }

    /**
     * POST /api/learning-path/save-speech-assessment
     * Save speech assessment result directly to vocab_question_attempts
     * Called after user completes pronunciation question on LearningPathPage
     */
    @PostMapping("/save-speech-assessment")
    public ResponseEntity<?> saveSpeechAssessment(
            @RequestParam Long enrollmentId,
            @RequestParam Long questionId,
            @RequestParam Double score,
            @RequestParam(required = false) String transcription,
            @RequestParam(required = false) String audioUrl) {
        try {
            System.out.println("💾 /save-speech-assessment endpoint called");
            System.out.println("📝 Enrollment: " + enrollmentId + ", Question: " + questionId + ", Score: " + score);
            
            Map<String, Object> response = vocabQuestionService.saveSpeechAssessmentResult(
                enrollmentId, questionId, score, transcription, audioUrl
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error in /save-speech-assessment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body("Lỗi lưu kết quả phát âm: " + e.getMessage());
        }
    }

    /**
     * GET /api/learning-path/{enrollmentId}/progress
     * Get enrollment progress and stats (similar to SpeakingTestService)
     */
    @GetMapping("/{enrollmentId}/progress")
    public ResponseEntity<?> getEnrollmentProgress(@PathVariable Long enrollmentId) {
        try {
            System.out.println("📊 /progress endpoint called for enrollment: " + enrollmentId);
            
            Double averageScore = vocabQuestionService.getEnrollmentAverageScore(enrollmentId);
            
            var response = new java.util.HashMap<>();
            response.put("enrollmentId", enrollmentId);
            response.put("averageScore", averageScore);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error in /progress: " + e.getMessage());
            return ResponseEntity.status(400).body("Lỗi: " + e.getMessage());
        }
    }
}
