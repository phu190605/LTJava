package com.aesp.backend.service;

import com.aesp.backend.dto.request.VocabQuestionScoreRequest;
import com.aesp.backend.entity.VocabQuestionAttempt;
import com.aesp.backend.entity.UserLearningPath;
import com.aesp.backend.entity.LearningPathVocabQuestion;
import com.aesp.backend.repository.VocabQuestionAttemptRepository;
import com.aesp.backend.repository.UserLearningPathRepository;
import com.aesp.backend.repository.LearningPathVocabQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VocabQuestionService {

    @Autowired
    private VocabQuestionAttemptRepository attemptRepository;

    @Autowired
    private UserLearningPathRepository enrollmentRepository;

    @Autowired
    private LearningPathVocabQuestionRepository questionRepository;

    /**
     * Submit a vocab question score
     * Reuses similar logic to SpeakingTestService
     */
    public Map<String, Object> submitQuestionScore(VocabQuestionScoreRequest request) {
        System.out.println("📝 Submitting vocab question score for question: " + request.getQuestionId());
        
        try {
            // Get enrollment
            Optional<UserLearningPath> enrollmentOpt = enrollmentRepository.findById(request.getEnrollmentId());
            if (enrollmentOpt.isEmpty()) {
                throw new RuntimeException("Enrollment not found with ID: " + request.getEnrollmentId());
            }
            UserLearningPath enrollment = enrollmentOpt.get();
            System.out.println("✅ Found enrollment: " + enrollment.getId());
            
            // Get question
            Optional<LearningPathVocabQuestion> questionOpt = questionRepository.findById(request.getQuestionId());
            if (questionOpt.isEmpty()) {
                throw new RuntimeException("Question not found with ID: " + request.getQuestionId());
            }
            LearningPathVocabQuestion question = questionOpt.get();
            System.out.println("✅ Found question: " + question.getId());
            
            // Find or create attempt record
            Optional<VocabQuestionAttempt> existingAttempt = attemptRepository.findByEnrollmentAndQuestion(enrollment, question);
            VocabQuestionAttempt attempt;
            
            if (existingAttempt.isPresent()) {
                attempt = existingAttempt.get();
                // Increment attempt count
                attempt.setAttemptCount((attempt.getAttemptCount() != null ? attempt.getAttemptCount() : 0) + 1);
                System.out.println("🔄 Updating existing attempt, attempt count: " + attempt.getAttemptCount());
            } else {
                attempt = new VocabQuestionAttempt();
                attempt.setEnrollment(enrollment);
                attempt.setQuestion(question);
                attempt.setAttemptCount(1);
                System.out.println("✨ Creating new attempt");
            }
            
            // Update attempt data
            attempt.setUserAnswer(request.getUserAnswer());
            attempt.setScore(request.getScore() != null ? request.getScore() : 0);
            attempt.setAudioUrl(request.getAudioUrl());
            attempt.setUpdatedAt(LocalDateTime.now());
            
            // Save attempt
            VocabQuestionAttempt saved = attemptRepository.save(attempt);
            System.out.println("✅ Saved attempt with score: " + saved.getScore());
            
            // Calculate enrollment progress based on completed questions
            updateEnrollmentProgress(enrollment);
            
            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("attemptId", saved.getId());
            response.put("questionId", saved.getQuestion().getId());
            response.put("enrollmentId", saved.getEnrollment().getId());
            response.put("userAnswer", saved.getUserAnswer());
            response.put("score", saved.getScore());
            response.put("correctAnswer", saved.getQuestion().getAnswer());
            response.put("attemptCount", saved.getAttemptCount());
            response.put("timestamp", saved.getUpdatedAt());
            
            return response;
        } catch (Exception e) {
            System.out.println("❌ Error submitting score: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error submitting score: " + e.getMessage());
        }
    }
    
    /**
     * Calculate and update enrollment progress
     * Reuses speaking test logic: progress = (completed questions / total questions) * 100
     */
    private void updateEnrollmentProgress(UserLearningPath enrollment) {
        try {
            // Get all attempts for this enrollment
            List<VocabQuestionAttempt> attempts = attemptRepository.findByEnrollment(enrollment);
            if (attempts.isEmpty()) {
                return;
            }
            
            // Count questions with score >= 70 as "completed"
            long completedCount = attempts.stream()
                    .filter(a -> a.getScore() != null && a.getScore() >= 70)
                    .count();
            
            // Get total questions for this learning path
            long totalQuestions = attempts.size();
            
            // Calculate progress
            int progress = (int) ((completedCount * 100) / totalQuestions);
            
            System.out.println("📊 Progress Update - Completed: " + completedCount + " / " + totalQuestions + " = " + progress + "%");
            
            enrollment.setProgress(progress);
            enrollment.setUpdatedAt(LocalDateTime.now());
            enrollmentRepository.save(enrollment);
            System.out.println("✅ Enrollment progress updated to: " + progress + "%");
        } catch (Exception e) {
            System.out.println("⚠️ Error updating progress: " + e.getMessage());
        }
    }
    
    /**
     * Get all attempts for an enrollment
     */
    public List<VocabQuestionAttempt> getEnrollmentAttempts(Long enrollmentId) {
        return attemptRepository.findByEnrollment_Id(enrollmentId);
    }
    
    /**
     * Get average score for an enrollment (similar to SpeakingTestService)
     */
    public Double getEnrollmentAverageScore(Long enrollmentId) {
        try {
            Optional<UserLearningPath> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
            if (enrollmentOpt.isEmpty()) {
                return 0.0;
            }
            
            List<VocabQuestionAttempt> attempts = attemptRepository.findByEnrollment(enrollmentOpt.get());
            if (attempts.isEmpty()) {
                return 0.0;
            }
            
            double average = attempts.stream()
                    .mapToDouble(a -> a.getScore() != null ? a.getScore() : 0)
                    .average()
                    .orElse(0.0);
            
            System.out.println("📊 Average score for enrollment " + enrollmentId + ": " + average);
            return average;
        } catch (Exception e) {
            System.out.println("❌ Error calculating average score: " + e.getMessage());
            return 0.0;
        }
    }
    
    /**
     * Save speech assessment result to vocab_question_attempts
     * Called after user completes a pronunciation question on LearningPathPage
     * 
     * @param enrollmentId User's learning path enrollment ID
     * @param questionId The vocab question ID from learning_path_vocab_questions
     * @param score Overall score from Azure Speech API (0-100)
     * @param transcription User's answer (what they said)
     * @param audioUrl URL to the recorded audio
     * @return Response with saved attempt details
     */
    public Map<String, Object> saveSpeechAssessmentResult(Long enrollmentId, Long questionId, 
                                                         Double score, String transcription, String audioUrl) {
        System.out.println("💾 Saving speech assessment to vocab_question_attempts - Enrollment: " + enrollmentId + 
                          ", Question: " + questionId + ", Score: " + score);
        
        try {
            // Get enrollment
            Optional<UserLearningPath> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
            if (enrollmentOpt.isEmpty()) {
                throw new RuntimeException("Enrollment not found with ID: " + enrollmentId);
            }
            UserLearningPath enrollment = enrollmentOpt.get();
            System.out.println("✅ Found enrollment: " + enrollment.getId());
            
            // Get question
            Optional<LearningPathVocabQuestion> questionOpt = questionRepository.findById(questionId);
            if (questionOpt.isEmpty()) {
                throw new RuntimeException("Question not found with ID: " + questionId);
            }
            LearningPathVocabQuestion question = questionOpt.get();
            System.out.println("✅ Found question: " + question.getId());
            
            // Find or create attempt record
            Optional<VocabQuestionAttempt> existingAttempt = attemptRepository.findByEnrollmentAndQuestion(enrollment, question);
            VocabQuestionAttempt attempt;
            
            if (existingAttempt.isPresent()) {
                attempt = existingAttempt.get();
                // Increment attempt count
                attempt.setAttemptCount((attempt.getAttemptCount() != null ? attempt.getAttemptCount() : 0) + 1);
                System.out.println("🔄 Updating existing attempt, attempt count: " + attempt.getAttemptCount());
            } else {
                attempt = new VocabQuestionAttempt();
                attempt.setEnrollment(enrollment);
                attempt.setQuestion(question);
                attempt.setAttemptCount(1);
                System.out.println("✨ Creating new attempt from speech assessment");
            }
            
            // Update attempt data from speech assessment
            attempt.setUserAnswer(transcription != null ? transcription : "");
            attempt.setScore(score != null ? score.intValue() : 0);  // Convert Double to Integer
            attempt.setAudioUrl(audioUrl);
            attempt.setUpdatedAt(LocalDateTime.now());
            
            // Save attempt
            VocabQuestionAttempt saved = attemptRepository.save(attempt);
            System.out.println("✅ Saved speech assessment attempt with score: " + saved.getScore());
            
            // Calculate enrollment progress
            updateEnrollmentProgress(enrollment);
            
            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("attemptId", saved.getId());
            response.put("questionId", saved.getQuestion().getId());
            response.put("enrollmentId", saved.getEnrollment().getId());
            response.put("userAnswer", saved.getUserAnswer());
            response.put("score", saved.getScore());
            response.put("correctAnswer", saved.getQuestion().getAnswer());
            response.put("attemptCount", saved.getAttemptCount());
            response.put("timestamp", saved.getUpdatedAt());
            response.put("message", "Speech assessment saved to vocab attempts");
            
            return response;
        } catch (Exception e) {
            System.out.println("❌ Error saving speech assessment: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error saving speech assessment: " + e.getMessage());
        }
    }
}
