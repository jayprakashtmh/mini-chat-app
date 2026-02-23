import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Stack,
  Avatar
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../api/axios";

function ChatBox({ selectedUser }) {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const messageEndRef = useRef(null);

  const currentUser = localStorage.getItem("username");

  const topic = selectedUser
    ? "/user/queue/private"
    : "/topic/general";

  // Load History
  useEffect(() => {
    const loadHistory = async () => {
      if (selectedUser) {
        const res = await api.get(`/messages/private/${selectedUser}`);
        setMessages(res.data);
      } else {
        const res = await api.get("/messages/general");
        setMessages(res.data);
      }
    };

    loadHistory();
  }, [selectedUser]);

  // Auto Scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket
  useEffect(() => {

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("http://localhost:8080/chat"),

      connectHeaders: {
        Authorization:
          "Bearer " + localStorage.getItem("token")
      },

      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        client.subscribe(topic, message => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [...prev, msg]);
        });
      },

      onDisconnect: () => setConnected(false)
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();

  }, [topic]);

  const sendMessage = () => {
    if (!connected || !input.trim()) return;

    clientRef.current.publish({
      destination: "/app/send",
      body: JSON.stringify({
        content: input,
        receiverUsername: selectedUser || null
      })
    });

    setInput("");
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: "#fff",
          borderBottom: "1px solid #ddd"
        }}
      >
        <Typography variant="h6">
          {selectedUser
            ? selectedUser
            : "General Chat"}
        </Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          background: "#e5ddd5"
        }}
      >
        <Stack spacing={2}>
          {messages.map((msg, index) => {

            const isMine =
              msg.sender?.username === currentUser;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isMine
                    ? "flex-end"
                    : "flex-start"
                }}
              >
                <Box
                  sx={{
                    bgcolor: isMine ? "#1976d2" : "#fff",
                    color: isMine ? "#fff" : "#000",
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    maxWidth: "60%",
                    boxShadow: 1
                  }}
                >
                  {!isMine && (
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600 }}
                    >
                      {msg.sender?.username}
                    </Typography>
                  )}

                  <Typography variant="body2">
                    {msg.content}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      opacity: 0.6
                    }}
                  >
                    {msg.timestamp
                      ? new Date(msg.timestamp)
                          .toLocaleTimeString()
                      : ""}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={messageEndRef} />
        </Stack>
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          background: "#fff",
          borderTop: "1px solid #ddd",
          display: "flex"
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatBox;