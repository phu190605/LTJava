package com.aesp.backend.peer.service;

import com.aesp.backend.peer.model.PeerUserSession;
import com.aesp.backend.peer.model.Room;
import com.aesp.backend.peer.model.RoomStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Service
public class PeerMatchService {

    private final List<Room> rooms = new ArrayList<>();

    /**
     * MATCH USER THEO TOPIC
     */
    public synchronized Room matchUser(PeerUserSession user) {

        for (Room room : rooms) {
            if (room.getStatus() == RoomStatus.WAITING
                    && room.getTopic().equals(user.getTopic())
                    && room.getParticipants().size() < 2) {

                room.addUser(user);

                if (room.getParticipants().size() == 2) {
                    room.setStatus(RoomStatus.ACTIVE);
                }

                return room;
            }
        }

        Room newRoom = new Room();
        newRoom.setRoomId(UUID.randomUUID().toString());
        newRoom.setTopic(user.getTopic());
        newRoom.setStatus(RoomStatus.WAITING);
        newRoom.addUser(user);

        rooms.add(newRoom);
        return newRoom;
    }

    public synchronized Room findRoomById(String roomId) {
        return rooms.stream()
                .filter(r -> r.getRoomId().equals(roomId))
                .findFirst()
                .orElse(null);
    }

    public synchronized Room findRoomBySession(WebSocketSession session) {
        for (Room room : rooms) {
            for (PeerUserSession user : room.getParticipants()) {
                if (user.getSession().equals(session)) {
                    return room;
                }
            }
        }
        return null;
    }

    public synchronized void removeRoom(String roomId) {
        rooms.removeIf(r -> r.getRoomId().equals(roomId));
    }

    public synchronized void removeUserBySession(WebSocketSession session) {

        Iterator<Room> it = rooms.iterator();

        while (it.hasNext()) {
            Room room = it.next();

            room.getParticipants().removeIf(
                    u -> u.getSession().equals(session)
            );

            if (room.getParticipants().isEmpty()) {
                it.remove();
            } else if (room.getParticipants().size() == 1) {
                room.setStatus(RoomStatus.WAITING);
            }
        }
    }
}
