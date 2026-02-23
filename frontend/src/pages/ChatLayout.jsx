import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";

function ChatLayout() {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/users");
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <Navbar />

      <Box sx={{ flex: 1, display: "flex", background: "#eceff1" }}>

        {/* Sidebar */}
        <Box
          sx={{
            width: 300,
            background: "#fff",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography variant="h6" sx={{ p: 2 }}>
            Chats
          </Typography>

          <Divider />

          <List sx={{ flex: 1, overflowY: "auto" }}>

            <ListItemButton
              selected={!selectedUser}
              onClick={() => setSelectedUser(null)}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#1976d2" }}>
                  <GroupIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="General Chat" />
            </ListItemButton>

            {users.map(user => (
              <ListItemButton
                key={user}
                selected={selectedUser === user}
                onClick={() => setSelectedUser(user)}
              >
                <ListItemAvatar>
                  <Avatar>
                    {user.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user} />
              </ListItemButton>
            ))}

          </List>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: "flex" }}>
          <ChatBox selectedUser={selectedUser} />
        </Box>

      </Box>
    </Box>
  );
}

export default ChatLayout;