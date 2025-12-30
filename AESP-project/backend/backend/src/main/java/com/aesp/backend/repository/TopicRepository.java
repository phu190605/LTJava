package com.aesp.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aesp.backend.entity.Topic;

public interface TopicRepository extends JpaRepository<Topic, Integer> {}