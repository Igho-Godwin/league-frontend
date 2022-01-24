import * as React from "react";

import Moment from "moment";

import { useDispatch } from "react-redux";


import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TablePagination from "@mui/material/TablePagination";

import Title from "./Title";

import { deleteToken } from "../redux/actions/tokenActions";

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Messages({
  data,
  searchValue,
  onChange,
  handleSearch,
  handleChangeRowsPerPage,
  handleChangePage,
  page,
  rowsPerPage,
  viewResponses,
  conversations,
  currentMessage,
  currentUserId,
  handleResponse,
  onResponseTextChange,
  responseText,
}) {
  const [open, setOpen] = React.useState(false);

  Moment.locale("en");

  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(deleteToken());
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Title>Recent Messages</Title>
      <Box
        style={{
          textAlign: "right",
          textDecoration: "underline",
          color: "blue",
          cursor: "pointer",
        }}
        onClick={logOut}
      >
        Logout
      </Box>
      <Box
        component="form"
        onSubmit={handleSearch}
        noValidate
        sx={{ textAlign: "center", mt: 5, mb: 5 }}
      >
        <TextField
          id="outlined-basic"
          label="Search(customers or messages)"
          variant="outlined"
          value={searchValue}
          onChange={onChange}
        />{" "}
        <Button type="submit" variant="outlined" style={{ minHeight: "55px" }}>
          Search
        </Button>
      </Box>
      <Table size="small" style={{ maxWidth: "100%", overflow: "scroll" }}>
        <TableHead>
          <TableRow>
            <TableCell>UserID</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>has being responded to</TableCell>
            <TableCell>respond</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.message}</TableCell>
                <TableCell>
                  {Moment(row.entryDate).format("DD-MM-yyyy HH:MM:SS")}
                </TableCell>
                <TableCell>{row.agentId === null ? "No" : "Yes"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      viewResponses(row.messageId, row.message, row.userId);
                      handleClickOpen();
                    }}
                  >
                    Respond
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data.count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Conversations For {currentUserId}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ pl: 5, maxHeight: "70%", overflow: "scroll" }}>
            <Box sx={{ color: "blue", mt: 2 }}>customer: {currentMessage}</Box>
            {conversations &&
              conversations.map((conversation) =>
                conversation.from === "Agent" ? (
                  <Box key={conversation.id} sx={{ color: "green", mt: 2 }}>
                    Agent: {conversation.response}
                  </Box>
                ) : (
                  <Box key={conversation.id} sx={{ color: "blue", mt: 2 }}>
                    customer: {conversation.response}
                  </Box>
                )
              )}
          </Box>
          <Box component="form" onSubmit={handleResponse} sx={{ pl: 5 }}>
            <TextareaAutosize
              aria-label=""
              placeholder="Enter Response"
              style={{ width: "90%", height: "100px", marginTop: "20px" }}
              onChange={onResponseTextChange}
              value={responseText}
            />
            <Button type="Submit" variant="outlined" style={{ width: "90%" }}>
              Submit
            </Button>
          </Box>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
