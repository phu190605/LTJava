package com.aesp.backend.event;

import java.util.Map;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;

@Getter
public class SessionCompletedEvent extends ApplicationEvent {
    private final Long userId;
    private final Map<String, Object> sessionStats;

    public SessionCompletedEvent(Object source, Long userId, Map<String, Object> sessionStats) {
        super(source);
        this.userId = userId;
        this.sessionStats = sessionStats;
    }
}
