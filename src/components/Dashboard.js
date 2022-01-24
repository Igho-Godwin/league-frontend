import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";

import Messages from "./Messages";
import useFetch from "../hooks/useFetch";
import { API_URL } from "./config";

const drawerWidth = 0;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const Dashboard = () => {
  const [open, setOpen] = React.useState(true);

  const [searchValue, setSearchValue] = React.useState("");

  const [messageData, setMessageData] = React.useState([]);

  const [conversations, setConversation] = React.useState([]);

  const [currentMessage, setCurrentMessage] = React.useState("");

  const [currentUserId, setCurrentUserId] = React.useState("");

  const [responseText, setResponseText] = React.useState("");

  const [currentMessageId, setCurrentMessageId] = React.useState("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const token = useSelector((state) => state.tokenReducers.token);

  const navigate = useNavigate();

  if (!token) {
    navigate("../");
  }

  const { status, data } = useFetch(API_URL + "messages?offset=0&limit=10");

  useEffect(() => {
    setMessageData(data);
  }, [data]);

  if (status === "error") {
    return <div>Error occurred</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "empty") {
    return <div>No data</div>;
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const onResponseTextChange = ({ currentTarget: input }) => {
    setResponseText(input.value);
  };

  const handleChange = ({ currentTarget: input }) => {
    setSearchValue(input.value);
  };

  const handleChangePage = async (event, newPage) => {
    const url =
      API_URL + `messages?offset=${newPage * 10}&limit=${rowsPerPage}`;
    if (searchValue !== "") {
      const url =
        API_URL +
        `messages?offset=${
          newPage * 10
        }&limit=${rowsPerPage}&param=${searchValue}`;
    }
    try {
      const response = await axios(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: token.payload,
        },
      });

      const data = response.data.data;

      if (data.count > 0) {
        setMessageData(data);
      }
    } catch (err) {
      console.log(err);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    const url = API_URL + `messages?offset=0&limit=${event.target.value}`;
    if (searchValue !== "") {
      const url =
        API_URL +
        `messages?offset=${page * 10}&limit=${
          event.target.value
        }&param=${searchValue}`;
    }
    try {
      const response = await axios(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: token.payload,
        },
      });

      const data = response.data.data;

      if (data.count > 0) {
        setMessageData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleResponse = async (event) => {
    event.preventDefault();
    const userId = currentUserId;
    const messageId = currentMessageId;
    const url = API_URL + `agent/response/create`;
    try {
      const response = await axios(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: token.payload,
        },
        data: {
          response: responseText,
          userId,
          messageId,
        },
      });

      const data = response.data.data;

      if (data) {
        const oldConversation = [...conversations];
        const newConversations = [...oldConversation, data];
        const oldMessageData = [...messageData.rows];
        const oldMessageCount = messageData.count;
        oldMessageData.map((data) => {
          if (data.messageId === messageId) {
            return (data.agentId =
              newConversations[newConversations.length - 1].agentId);
          }
        });
        setMessageData({ count: oldMessageCount, rows: oldMessageData });
        setConversation(newConversations);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setPage(0);
    const url = API_URL + `messages?offset=0&limit=10&param=${searchValue}`;
    try {
      const response = await axios(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: token.payload,
        },
      });

      const data = response.data.data;

      if (data.count > 0) {
        setMessageData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const viewResponses = async (messageId, message, userId) => {
    setCurrentMessage(message);
    setCurrentUserId(userId);
    setCurrentMessageId(messageId);
    let finalData = [];
    const url = API_URL + `agent/response/all?messageId=${messageId}`;
    try {
      const response = await axios(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: token.payload,
        },
      });

      finalData = response.data.data;
    } catch (err) {
      console.log(err);
    }

    setConversation(finalData);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    overflow: "scroll",
                  }}
                >
                  {messageData.count && (
                    <Messages
                      data={messageData}
                      handleSearch={handleSearch}
                      onChange={handleChange}
                      searchValue={searchValue}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      handleChangePage={handleChangePage}
                      viewResponses={viewResponses}
                      conversations={conversations}
                      currentMessage={currentMessage}
                      currentUserId={currentUserId}
                      handleResponse={handleResponse}
                      onResponseTextChange={onResponseTextChange}
                      responseText={responseText}
                    />
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
