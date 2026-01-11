package com.aesp.backend.peer.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class Room {

    // ID phòng
    private String roomId = UUID.randomUUID().toString();

    // Chủ đề luyện nói (Daily / Travel / Business)
    private String topic;

    // Trạng thái phòng
    private RoomStatus status = RoomStatus.WAITING;

    // Danh sách người trong phòng (tối đa 2)
    private List<PeerUserSession> participants = new ArrayList<>();

    // ===== DÙNG CHO VOICE / UI =====
    private String currentSpeaker;

    /**
     * Kiểm tra phòng đã đủ 2 người chưa
     */
    public boolean isFull() {
        return participants.size() >= 2;
    }

    /**
     * Thêm user vào phòng
     */
    public void addUser(PeerUserSession user) {
        participants.add(user);

        if (participants.size() == 2) {
            status = RoomStatus.ACTIVE;
        }
    }
}
