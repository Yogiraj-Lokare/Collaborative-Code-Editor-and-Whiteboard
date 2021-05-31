import { Button } from "@chakra-ui/button";
import { AddIcon, UnlockIcon } from "@chakra-ui/icons";
import { AppBar, Dialog, Toolbar } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants/Constants";
import InputForm from "../../../ReusableComponents/InputForm";
import { logout } from "../../../utils/Auth";
import "./index.css";

const HomePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(!open);
  };
  return (
    <React.Fragment>
      <div className="box">
        <div className="nav-bar">
          <div style={{ fontSize: "1.5vw" }}>
            {localStorage.getItem("username")}
          </div>
          <Button
            backgroundColor="twitter.400"
            onClick={() => setOpen(true)}
            leftIcon={<AddIcon />}
          >
            New Interview
          </Button>
          <Button
            rightIcon={<UnlockIcon />}
            marginRight="10"
            backgroundColor="red.300"
            onClick={logout}
          >
            logout
          </Button>
        </div>
        <DialogWrapper open={open} handleClose={handleClose} />
        <InterviewsList />
      </div>
    </React.Fragment>
  );
};

const DialogWrapper: React.FC<any> = ({ handleClose, open }) => {
  return (
    <React.Fragment>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <NewInterviewSheduleForm handleClose={handleClose} />
      </Dialog>
    </React.Fragment>
  );
};

const NewInterviewSheduleForm: React.FC<any> = ({ handleClose }) => {
  const SubmitHandler = async (e: any) => {
    e.preventDefault();
    const sheduleData = {
      interviewer: localStorage.getItem("email"),
      participents: [
        {
          name: e.target.name.value,
          email: e.target.email.value,
        },
      ],
      roomID: (Math.random() * 10000).toString(),
      start_time: e.target.time.value,
    };

    await axios.post(`${SERVER_URL}interview/shedule/`, sheduleData);
    handleClose();
  };

  return (
    <React.Fragment>
      <div className="container">
        <span className="chip">New Interview</span>
        <div className="main-text">
          Add the Candidate details and Interview time
        </div>
        <div className="form-container">
          <form
            onSubmit={(e) => {
              SubmitHandler(e);
            }}
          >
            {SheduleFormParameters.map(({ key, name, type, placeholder }) => {
              return (
                <InputForm
                  key={key}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                />
              );
            })}
            <div className="button-wrapper">
              <Button backgroundColor="blue.200" type="submit">
                Shedule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

const InterviewsList = () => {
  const [meetings, setMeetings] = useState([]);
  const fetchmeetings = async () => {
    const { data } = await axios.get(`${SERVER_URL}interview/myinterviews`);
    setMeetings(data);
  };
  useEffect(() => {
    fetchmeetings();
  }, []);

  return (
    <React.Fragment>
      {meetings.length == 0 ? (
        <div>No meetings</div>
      ) : (
        <>
          {meetings.map(
            ({ _id, participents, start_time, roomID, end_time }) => {
              return (
                <InterviewDetails
                  key={_id}
                  _id={_id}
                  participents={participents}
                  start_time={start_time}
                  roomID={roomID}
                  end_time={end_time}
                />
              );
            }
          )}
        </>
      )}
    </React.Fragment>
  );
};

const InterviewDetails: React.FC<any> = ({
  _id,
  participents,
  start_time,
  end_time,
  roomID,
}) => {
  const meetingLink = () => {
    let code = {
      name: participents[0].name,
      email: participents[0].email,
      roomID: roomID,
    };
    let trial = `/${code.name}/${code.email}/${code.roomID}`;
    let URL = `http://localhost:3000/interview${trial}`;
    console.log(URL);
  };

  return (
    <React.Fragment>
      <div className="sec-container">
        <div className="homepage-shedule">
          <div className="homepage-time">
            {new Date(start_time).toLocaleString()}
          </div>
          <div className="homepage-user-details">
            <div>{participents[0].name}</div>
            <div className="homepage-email">{participents[0].email}</div>
          </div>
        </div>
        <div className="homepage-button-wrapper">
          <div className="homepage-share-button">
            <Button onClick={meetingLink} size="sm" backgroundColor="red.200">
              Copy the meeting link
            </Button>
          </div>
          <div className="homepage-join">
            <Button backgroundColor="twitter.300" width="24">
              <a
                href={`http://localhost:3000/interview/${localStorage.getItem(
                  "username"
                )}/${localStorage.getItem("email")}/${roomID}`}
              >
                Start
              </a>
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomePage;

const SheduleFormParameters = [
  {
    key: 1,
    name: "name",
    type: "text",
    placeholder: "Name",
  },
  {
    key: 2,
    name: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    key: 3,
    name: "time",
    type: "datetime-local",
    placeholder: "Time",
  },
];
