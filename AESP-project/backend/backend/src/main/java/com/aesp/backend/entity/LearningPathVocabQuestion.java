package com.aesp.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_path_vocab_questions")
public class LearningPathVocabQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "level")
    private String level;
    
    @Column(name = "goal_code")
    private String goalCode;
    
    @Column(name = "topic_code")
    private String topicCode;
    
    @Column(name = "question", columnDefinition = "VARCHAR(255)")
    private String question;
    
    @Column(name = "answer", columnDefinition = "VARCHAR(255)")
    private String answer;
    
    @Column(name = "choices", columnDefinition = "VARCHAR(255)")
    private String choices; // CSV format: "choice1,choice2,choice3,choice4"
    
    // ===== CONSTRUCTORS =====
    public LearningPathVocabQuestion() {}
    
    public LearningPathVocabQuestion(String level, String goalCode, String topicCode, 
                                     String question, String answer, String choices) {
        this.level = level;
        this.goalCode = goalCode;
        this.topicCode = topicCode;
        this.question = question;
        this.answer = answer;
        this.choices = choices;
    }
    
    // ===== GETTERS & SETTERS =====
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getLevel() {
        return level;
    }
    
    public void setLevel(String level) {
        this.level = level;
    }
    
    public String getGoalCode() {
        return goalCode;
    }
    
    public void setGoalCode(String goalCode) {
        this.goalCode = goalCode;
    }
    
    public String getTopicCode() {
        return topicCode;
    }
    
    public void setTopicCode(String topicCode) {
        this.topicCode = topicCode;
    }
    
    public String getQuestion() {
        return question;
    }
    
    public void setQuestion(String question) {
        this.question = question;
    }
    
    public String getAnswer() {
        return answer;
    }
    
    public void setAnswer(String answer) {
        this.answer = answer;
    }
    
    public String getChoices() {
        return choices;
    }
    
    public void setChoices(String choices) {
        this.choices = choices;
    }
}
