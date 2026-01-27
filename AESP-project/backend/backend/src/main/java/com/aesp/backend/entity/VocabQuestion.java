package com.aesp.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vocab_questions")
public class VocabQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;
    private String answer;
    private String choices; // JSON hoặc phân cách bằng dấu phẩy
    private String topic; // hoặc challengeType nếu muốn phân loại

    // Getter, Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getChoices() { return choices; }
    public void setChoices(String choices) { this.choices = choices; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}
