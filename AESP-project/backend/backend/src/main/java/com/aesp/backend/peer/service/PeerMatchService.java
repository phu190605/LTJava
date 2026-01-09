@Service
public class PeerMatchService {

    private final List<Room> rooms = new ArrayList<>();

    public synchronized Room matchUser(PeerUserSession user) {

        for (Room room : rooms) {
            if (room.getStatus() == RoomStatus.WAITING
                    && room.getTopic().equals(user.getTopic())
                    && room.getParticipants().size() < 2) {

                room.addUser(user);
                room.setStatus(RoomStatus.ACTIVE);
                return room;
            }
        }

        Room room = new Room();
        room.setRoomId(UUID.randomUUID().toString());
        room.setTopic(user.getTopic());
        room.setStatus(RoomStatus.WAITING);
        room.addUser(user);

        rooms.add(room);
        return room;
    }

    public Room findRoomById(String roomId) {
        return rooms.stream()
                .filter(r -> r.getRoomId().equals(roomId))
                .findFirst()
                .orElse(null);
    }
}
