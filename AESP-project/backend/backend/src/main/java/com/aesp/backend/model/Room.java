package com.aesp.backend.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Room {
    public enum State { WAITING, ACTIVE, FINISHED }

    private String id;
    private String topic;
    private String level;
    private List<String> participants = new ArrayList<>();
    private State state = State.WAITING;

    public Room(String id, String topic, String level) {
        this.id = id;
        this.topic = topic;
        this.level = level;
    }
}
