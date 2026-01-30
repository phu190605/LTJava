package com.aesp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.aesp.backend.entity.WordDetail;
import com.aesp.backend.entity.SpeechAssessment;
import java.util.List;

@Repository
public interface WordDetailRepository extends JpaRepository<WordDetail, Long> {
    
    // Lấy word detail theo speech assessment
    List<WordDetail> findBySpeechAssessment(SpeechAssessment speechAssessment);
    
    // Lấy theo từ
    List<WordDetail> findByWord(String word);
}
