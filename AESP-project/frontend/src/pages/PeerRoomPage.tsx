import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  Row, Col, Card, Button, Input, List, Avatar, Badge, Tabs, Tooltip,
  Typography, Modal, message, Switch
} from 'antd';
import {
  AudioOutlined, AudioMutedOutlined,
  VideoCameraOutlined, VideoCameraAddOutlined,
  PhoneOutlined, SendOutlined,
  UserOutlined, TeamOutlined,
  MessageOutlined, MoreOutlined, SoundOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;

type MessageItem = { id: number; user: string; text: string; isMe?: boolean; type?: 'text' | 'voice'; };
type Participant = { id: number; name: string; avatar: string; muted?: boolean; role?: 'teacher' | 'student' };

const INITIAL_MESSAGES: MessageItem[] = [
  { id: 1, user: 'Nguyễn Văn A', text: 'Xin chào mọi người!', isMe: false, type: 'text' },
  { id: 2, user: 'Bạn (Me)', text: 'Chào A, mình nghe rõ nhé.', isMe: true, type: 'text' },
  { id: 3, user: 'Trần Thị B', text: '0:15', isMe: false, type: 'voice' },
];

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 1, name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1', muted: false, role: 'student' },
  { id: 2, name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=2', muted: false, role: 'student' },
  { id: 3, name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?u=3', muted: true, role: 'student' },
  { id: 4, name: 'Bạn (Me)', avatar: 'https://i.pravatar.cc/150?u=me', muted: false, role: 'student' },
  { id: 10, name: 'Ms. Emma (Teacher)', avatar: 'https://i.pravatar.cc/120?img=12', muted: false, role: 'teacher' },
];

const VOICE_SAMPLE_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

const PeerRoomPage: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'members'>('chat');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [timer, setTimer] = useState(0);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const msgIdRef = useRef(messages.length + 1);

  useEffect(() => {
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = chatRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'm') setIsMicOn(s => !s);
      if (e.key === 'v') setIsCamOn(s => !s);
      if (e.key === 'c') setActiveTab('chat');
      if (e.key === 'p') setActiveTab('members');
      if (e.key === 'Escape') {
        confirmLeave(); // quick modal for leaving
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const sendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      message.warning('Nhập nội dung trước khi gửi');
      return;
    }
    const newMsg: MessageItem = { id: msgIdRef.current++, user: 'Bạn (Me)', text: trimmed, isMe: true, type: 'text' };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setActiveTab('chat');
  };

  const playVoice = async (msg: MessageItem) => {
    try {
      const audio = new Audio(VOICE_SAMPLE_URL);
      await audio.play();
      message.info(`Phát tin nhắn thoại: ${msg.user}`);
    } catch (err) {
      message.error('Không thể phát âm thanh');
    }
  };

  const toggleParticipantMute = (id: number) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, muted: !p.muted } : p));
    message.success('Cập nhật trạng thái micro thành công');
  };

  const confirmLeave = () => {
    confirm({
      title: 'Bạn có chắc muốn rời phòng?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này sẽ ngắt kết nối của bạn với lớp học.',
      okText: 'Rời phòng',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk() {
        message.success('Đã rời phòng');
        // TODO: redirect or cleanup
      }
    });
  };

  const renderSidebarContent = () => {
    if (activeTab === 'chat') {
      return (
        <div className="flex flex-col h-full">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-lg mb-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {!msg.isMe && <Avatar size="small" src={participants.find(p => p.name === msg.user)?.avatar} icon={<UserOutlined />} />}
                  <Text type="secondary" style={{ fontSize: 12 }}>{msg.user}</Text>
                </div>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${msg.isMe ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                  {msg.type === 'voice' ? (
                    <div onClick={() => playVoice(msg)} className="flex items-center gap-2 cursor-pointer hover:opacity-85">
                      <SoundOutlined /> <span>Tin nhắn thoại ({msg.text}) — nhấp để phát</span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <Input.Group compact className="flex items-stretch">
              <Tooltip title="Gửi voice demo">
                <Button
                  icon={<AudioOutlined />}
                  size="large"
                  onClick={() => {
                    const vmsg: MessageItem = { id: msgIdRef.current++, user: 'Bạn (Me)', text: '0:10', isMe: true, type: 'voice' };
                    setMessages(m => [...m, vmsg]);
                    setActiveTab('chat');
                  }}
                />
              </Tooltip>
              <Input
                style={{ width: 'calc(100% - 90px)' }}
                placeholder="Nhập tin nhắn..."
                size="large"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={sendMessage}
              />
              <Button type="primary" icon={<SendOutlined />} size="large" onClick={sendMessage} />
            </Input.Group>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto">
        <List
          itemLayout="horizontal"
          dataSource={participants}
          renderItem={(item) => (
            <List.Item actions={[
              <Button type="text" icon={item.muted ? <AudioMutedOutlined /> : <AudioOutlined />} size="small" onClick={() => toggleParticipantMute(item.id)} />,
              <Button type="text" icon={<VideoCameraOutlined />} size="small" />
            ]}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} size="large" />}
                title={<span className="font-semibold">{item.name} {item.role === 'teacher' && <Badge count={'GV'} style={{ backgroundColor: '#f50', marginLeft: 8 }} />}</span>}
                description={<span className="text-green-500 flex items-center gap-1 text-xs">● Online {item.muted && <span className="text-xs text-red-400">• muted</span>}</span>}
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="m-0 text-xl font-bold text-gray-800">English Live Class • Speaking Practice</h2>
            <Text type="secondary">Room ID: #EN-4421 • <Badge status="processing" text="Live" /></Text>
            <div className="text-xs text-gray-500 mt-1">Lesson: Role-play • Time: {formatTime(timer)}</div>
          </div>
          <div className="flex gap-2">
            <Button icon={<UserOutlined />}>Invite</Button>
            <Button danger onClick={confirmLeave}>Leave</Button>
          </div>
        </div>

        <Row gutter={16} className="flex-1 h-full">
          <Col span={16} className="h-full flex flex-col">
            <Card className="flex-1 bg-black border-0 shadow-lg body-full-height relative rounded-2xl overflow-hidden" bodyStyle={{ padding: 0, height: '100%' }}>
              <div className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2576"
                  className="w-full h-full object-cover opacity-90"
                  alt="Main Speaker"
                />

                <div className="absolute top-4 left-6 bg-white/5 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 flex items-center gap-3">
                  <Avatar src={participants.find(p => p.role === 'teacher')?.avatar} />
                  <div>
                    <div className="font-medium text-sm">Ms. Emma</div>
                    <div className="text-xs text-slate-300">Teacher</div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded-lg shadow-2xl border-2 border-white/20 overflow-hidden">
                  {isCamOn ? (
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574" className="w-full h-full object-cover" alt="Me" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white"><UserOutlined style={{ fontSize: 32 }} /></div>
                  )}
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                  <Tooltip title={isMicOn ? "Mute (M)" : "Unmute (M)"}>
                    <Button
                      shape="circle"
                      size="large"
                      type={isMicOn ? 'default' : 'primary'}
                      icon={isMicOn ? <AudioOutlined /> : <AudioMutedOutlined />}
                      onClick={() => setIsMicOn(s => !s)}
                    />
                  </Tooltip>

                  <Tooltip title={isCamOn ? "Turn off camera (V)" : "Turn on camera (V)"}>
                    <Button
                      shape="circle"
                      size="large"
                      type={isCamOn ? 'default' : 'primary'}
                      icon={isCamOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}
                      onClick={() => setIsCamOn(s => !s)}
                    />
                  </Tooltip>

                  <Button shape="circle" size="large" icon={<MoreOutlined />} />

                  <Button type="primary" danger shape="round" size="large" icon={<PhoneOutlined />} onClick={confirmLeave}>
                    Leave
                  </Button>
                </div>
              </div>
            </Card>

            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {/* Small participants strip */}
              {participants.filter(p => p.role !== 'teacher').slice(0, 6).map(p => (
                <div key={p.id} className="flex flex-col items-center gap-2 w-28">
                  <div className={`w-20 h-20 rounded-lg overflow-hidden ${p.muted ? 'opacity-60' : ''}`}>
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm text-center">{p.name}</div>
                </div>
              ))}
            </div>
          </Col>

          <Col span={8} className="h-full">
            <Card className="h-full shadow-lg rounded-2xl border-gray-200" bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 12 }}>
              <Tabs
                activeKey={activeTab}
                onChange={(k) => setActiveTab(k as 'chat' | 'members')}
                centered
                items={[
                  {
                    label: (<span><MessageOutlined /> Chat</span>),
                    key: 'chat'
                  },
                  {
                    label: (<span><TeamOutlined /> Participants <Badge count={participants.length} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} /></span>),
                    key: 'members'
                  }
                ]}
              />

              <div className="flex-1 mt-2 overflow-hidden h-full relative">
                {renderSidebarContent()}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default PeerRoomPage;