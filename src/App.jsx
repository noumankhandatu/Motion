import { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Textarea from "@mui/joy/Textarea";
import Loader from "./components/loader";
import SendIcon from "@mui/icons-material/Send";
import HelpIcon from "@mui/icons-material/Help";
import Avatar from "@mui/material/Avatar";
import "react-toastify/dist/ReactToastify.css";
import RotateRightIcon from "@mui/icons-material/RotateRight";

const VITE_OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;
const token = VITE_OPENAI_KEY;

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

function App() {
  const [loading, setLoading] = useState(false);
  const [ApiData, setApiData] = useState("");
  const [formData, setFormData] = useState({
    Name: "",
    areaParty: "",
    topic: "",
    newsArticleUrls: "",
    ideaMessage: "",
    sampleOral: "",
  });
  console.log(formData, "helo");
  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setApiData("Please Wait Loading ...");
    toast("The request may take a min please wait");
    const { Name, areaParty, topic, newsArticleUrls, ideaMessage, sampleOral } = formData;
    if (!Name || !areaParty || !topic) {
      return alert("please add all fields");
    }
    // api hit
    const response = await axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `
              I want you to imagine you are a political adviser, writing a motion for ${Name}for ${areaParty}.
              You should be an expert in political communications.
              I am going to give you an example motion. Pay attention to the writing style and structure of the motion.
              Here is the example motion: ${sampleOral ? sampleOral : ""}.
              I am going to ask you to draft a new motion about a topic.
               You should write the new motion in exactly the same writing style and structure as the sample motion.
               Now I want you to draft a new motion about the following topic:${topic} .
               Here are news articles for reference about the topics: ${newsArticleUrls} .
                Here are the key ideas: ${ideaMessage} ,beware and the minimum words should be atleast greater than 200}`,
            },
          ],
        },
        { headers }
      )
      .catch((err) => {
        toast.error("Please try again or contact developer");
        setLoading(false);
        console.log(err);
      });
    if (response && response?.data?.choices) {
      toast.success("Request Completed");
      setLoading(false);
      setApiData(response?.data?.choices[0]?.message?.content);
    }
    if (!response) {
      toast.warn("Please Try Again Later");
    }
  };

  const handleBack = () => {
    window.location.reload();
  };

  return (
    <>
      <ToastContainer />
      {ApiData && ApiData !== "" ? (
        <Box className="Box">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              border: "rounded-full",
            }}
          >
            <img width={"200px"} src="/motion_photo.gif" alt="" />
          </Box>
          <div style={{ marginTop: "50px", color: "#0b9616" }}>
            <h1>Motion Questions :</h1>
            <br />
            <Typography
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "18px",
                letterSpacing: 2,
              }}
            >
              {ApiData}
            </Typography>
          </div>
          <Button onClick={handleBack} sx={{ mt: 3 }} variant="contained" color="success" fullWidth endIcon={<HelpIcon />}>
            <b> Try Another Motion Question </b>
          </Button>
          <Button onClick={handleSubmit} sx={{ mt: 3 }} variant="contained" color="warning" fullWidth endIcon={<RotateRightIcon />}>
            <b> Generate Again </b>
          </Button>
        </Box>
      ) : (
        <Box className="Box">
          <div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4" sx={{ textAlign: "left", color: "#0b9616" }}>
                Motion
              </Typography>
              <Avatar alt="Remy Sharp" src={"/motion_Photo.gif"} sx={{ width: 56, height: 56 }} />
            </Box>

            <Box sx={{ mt: 4 }} />
          </div>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={handleSubmit}
          >
            <TextField label=" Name" variant="outlined" name="Name" color="success" value={formData.Name} onChange={handleChange} required />
            <TextField
              sx={{ mt: 3 }}
              label="Area/Party"
              variant="outlined"
              name="areaParty"
              color="success"
              value={formData.areaParty}
              onChange={handleChange}
              required
            />

            <TextField
              sx={{ mt: 3 }}
              label="Topic"
              variant="outlined"
              color="success"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
            />

            <TextField
              sx={{ mt: 3 }}
              label="Links to News Articles"
              variant="outlined"
              name="newsArticleUrls"
              color="success"
              value={formData.newsArticleUrls}
              onChange={handleChange}
            />
            <TextField
              sx={{ mt: 3 }}
              label="Idea/Key Message"
              variant="outlined"
              color="success"
              name="ideaMessage"
              value={formData.ideaMessage}
              onChange={handleChange}
            />
            <Textarea
              value={formData.sampleOral}
              onChange={handleChange}
              name="sampleOral"
              color="success"
              sx={{ mt: 3 }}
              minRows={5}
              placeholder="Sample Oral Question (optional)"
              size="lg"
            />
            {/* word count */}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Loader />
              </Box>
            ) : (
              <Button
                className="generate-button"
                sx={{ mt: 3 }}
                variant="contained"
                color="success"
                type="submit"
                endIcon={<SendIcon fontSize="large" />}
              >
                <b> Generate Motion Questions </b>
              </Button>
            )}
          </form>
        </Box>
      )}
    </>
  );
}

export default App;
