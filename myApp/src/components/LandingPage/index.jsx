import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import "./index.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const LandingPage = () => {
  const [bucketList, setBucketList] = useState([]);
  const [inputText, changeInputText] = useState("");
  const [storeVersion, setVersions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);


  const submitTheForm = async (e) => {
    e.preventDefault();
    setBucketList([]);
    const api = await fetch(
      `http://localhost:3000/getListOfObjects/${inputText}`
    );
    const data = await api.json();
    setBucketList([...bucketList, ...data]);
  };

  const getTheVersions = async (fileName) => {
    setIsOpen(!isOpen);
    const versionsApi = await fetch(
      `http://localhost:3000/listOfVersions/yolung`
    );
    const responseData = await versionsApi.json();
    const retrieveONlySpecificKyeName = responseData.filter(
      (eachItem) => eachItem.Key === fileName
    );
    setVersions([...storeVersion, ...retrieveONlySpecificKyeName]);
  };

  console.log(storeVersion)

  return (
    <>
      <form onSubmit={submitTheForm} className="container">
        <input
          type="text"
          onChange={(e) => changeInputText(e.target.value)}
          value={inputText}
        />
        <button type="submit">Submit</button>
        <div>
          <table
            border="1"
            cellPadding="10"
            width="90%"
            style={{ textAlign: "center" }}
          >
            <thead>
              <tr>
                <th>File Name</th>
                <th>Last Modified</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bucketList.map((eachItem) => (
                <tr key={eachItem.ETag}>
                  <td
                    className="file-name"
                    onClick={() => getTheVersions(eachItem.Key)}
                  >
                    {eachItem.Key}
                  </td>
                  <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
                    <table
                      border="1"
                      cellPadding="10"
                      width="100%"
                      style={{ textAlign: "center" }}
                    >
                      <tr>
                        <th>Version Id</th>
                        <th>Last Modified</th>
                        <th>Size</th>
      
                      </tr>
                      <tbody>
                        {storeVersion.map((eachItem) => (
                          <tr>
                            <th>{eachItem.VersionId}</th>
                            <th>{eachItem.LastModified}</th>
                            <th>{eachItem.Size}</th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <td>{eachItem.LastModified}</td>
                  <td>{eachItem.Size}</td>
                  <td>
                    <MdDeleteOutline />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
};

export default LandingPage;
