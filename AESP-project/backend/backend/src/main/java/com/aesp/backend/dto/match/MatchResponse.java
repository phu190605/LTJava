package com.aesp.backend.dto.match;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MatchResponse {
    private String roomId;
    private String peerClientId; // id of matched peer
    private String topic;
    private String level;
}
