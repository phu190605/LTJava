package com.aesp.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "conversations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"learner_id", "mentor_id"})
)
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "learner_id", nullable = false)
    private User learner;

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    public Conversation() {}

    public Conversation(User learner, User mentor) {
        this.learner = learner;
        this.mentor = mentor;
    }

    public Long getId() {
        return id;
    }

    public User getLearner() {
        return learner;
    }

    public void setLearner(User learner) {
        this.learner = learner;
    }

    public User getMentor() {
        return mentor;
    }

    public void setMentor(User mentor) {
        this.mentor = mentor;
    }
}
