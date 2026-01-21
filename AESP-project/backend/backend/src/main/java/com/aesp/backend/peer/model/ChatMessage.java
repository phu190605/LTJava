
package com.aesp.backend.peer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage implements Serializable {

    /**
     * ===== MESSAGE TYPE =====
     *
     * ----- ROOM / MATCHING -----
     * JOIN            : User join tìm bạn
     * MATCHED         : Ghép cặp thành công
     * ROOM_FINISHED   : Kết thúc cuộc trò chuyện (chủ động)
     *
     * ----- CHAT -----
     * CHAT            : Tin nhắn realtime
     *
     * ----- USER STATUS -----
     * USER_ONLINE     : User online (connect)
     * USER_OFFLINE    : User offline / disconnect
     *
     * ----- WEBRTC SIGNALING -----
     * OFFER           : SDP Offer
     * ANSWER          : SDP Answer
     * ICE             : ICE Candidate
     * -------------------------
     */
    private String type;

    /**
     * userId của người gửi (Thường là ID từ Database - dùng để so sánh logic)
     * - System message dùng: "SERVER"
     */
    private String sender;

    /**
     * Tên hiển thị của người gửi (Ví dụ: "phu")
     * Được lấy từ cột full_name trong Database. 
     * Frontend sẽ dùng trường này để hiển thị lên màn hình thay vì dùng ID.
     */
    private String senderName;

    /**
     * Nội dung:
     * - Chat text
     * - System notify
     * - Topic suggestion
     */
    private String content;

    /**
     * ID phòng peer (UUID)
     */
    private String roomId;

    /**
     * Dữ liệu WebRTC signaling:
     * - SDP
     * - ICE Candidate
     *
     * Backend chỉ relay, không xử lý
     */
    private Object data;
}