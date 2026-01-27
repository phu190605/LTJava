package com.aesp.backend.repository;

import com.aesp.backend.entity.Conversation;
import com.aesp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByLearnerAndMentor(User learner, User mentor);
}
