import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { PiDownloadSimple } from "react-icons/pi";
import "./index.css"
import axios from "axios"
import DragAndDrop from "../DragAndDrop"


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [storeVersion, setVersions] = useState([]);
  

  const getVersion = async (fileName) => {
    setOpen(!open);
    setVersions([])
    const versionsApi = await fetch(
      `http://localhost:3000/listOfVersions/yolung`
    );
    const responseData = await versionsApi.json();
    const retrieveONlySpecificKeyName = responseData.filter(
      (eachItem) => eachItem.Key === fileName
    );
    setVersions([...storeVersion, ...retrieveONlySpecificKeyName]);
  };

  

  return (
    <>
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => getVersion(row.Key)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.Key}
          </TableCell>
          <TableCell align="right">{row.LastModified}</TableCell>
          <TableCell align="right">{row.Size}</TableCell>
          <TableCell align="right">
            <CiEdit className="edit-icon"/>
            <MdDeleteOutline className="delete-icon"/>
            <PiDownloadSimple className="download-icon"/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Version Id</TableCell>
                      <TableCell>Last Modified</TableCell>
                      <TableCell align="right">Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {storeVersion.map((eachItem) => (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {eachItem.VersionId}
                        </TableCell>
                        <TableCell>{eachItem.LastModified}</TableCell>
                        <TableCell align="right">{eachItem.Size}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    </>
  );
}



Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};


const MyGridComponent = () => {
  const [inputText, changeInputText] = useState("");
  const [bucketList, setBucketList] = useState([]);
  const [buckName,setBuckName] = useState("")

  const submitTheForm = async (e) => {
    e.preventDefault();
    setBucketList([]);
    const api = await fetch(
      `http://localhost:3000/getListOfObjects/${inputText}`
    );
    const data = await api.json();
    setBucketList([...bucketList, ...data]);
  };

  const storeInputFunction = (e) => {
    changeInputText(e.target.value);
    setBuckName(e.target.value)
  }

  

  return (
    <form onSubmit={submitTheForm} className="form-container">
      <input
        type="text"
        onChange={storeInputFunction}
        value={inputText}
        className="input-box"
      />
      <button type="submit" className="button-style">Submit</button>
      <div className="arrangement-container">
        <DragAndDrop/>
      </div>
      
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>File Serving</TableCell>
              <TableCell align="right">Last Modified</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bucketList.map((row) => (
              <Row key={row.ETag} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  );
};

export default MyGridComponent;
