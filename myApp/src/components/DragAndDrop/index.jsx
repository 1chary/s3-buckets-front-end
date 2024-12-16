import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";



function DragAndDrop() {
  const [show, setShow] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [successMessage, displaySuccessMessage] = useState(false);
  const [failureMessage, displayFailureMessage] = useState(false);
  const [bucketList, setBucketList] = useState([]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const updateUI = async () => {
    setBucketList([]);
    const api = await fetch(
      `http://localhost:3000/getListOfObjects/yolung`
    );
    const data = await api.json();
    setBucketList([...bucketList, ...data]);
  };

  const uploadFile = async () => {
    try {
      const data = new FormData();
      data.append("file", filePath);
      const response = await axios.post(
        "http://localhost:3000/uploadFiles",
        data
      );
      if (response.statusText === "OK") {
        displaySuccessMessage(true);
        displayFailureMessage(false);
        updateUI();
      }
    } catch (e) {
      displayFailureMessage(true);
      displaySuccessMessage(false);
      console.log(`Error Uploading ${e}`);
    }
  };

  const displaySuccessToastify = () => {
    toast.success("Successfully Uploaded Data")
  }

  const displayFailureToastify = () => {
    toast.error("Failed To Upload Data")
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        + Upload New File
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a file to upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            onChange={(e) => setFilePath(e.target.files[0])}
            id="input-element"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={uploadFile}>
            Upload
          </Button>
          {successMessage && 
          <div>
            {displaySuccessToastify()}
            <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            type="success"
            />
          </div>
          
          }
          {failureMessage && 
          <div>
          {displayFailureToastify()}
          <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          type="success"
          />
        </div>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DragAndDrop;
