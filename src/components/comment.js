import React, { Component } from 'react'
import { TextField, Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { MuiThemeProvider, createTheme } from '@material-ui/core';
const theme = createTheme({
  overrides: {
    MuiInputBase: {
      MuiOutlinedInput: {
        input: {
          padding: "9.5px 12px"
        }
      }
    },
    MuiButton: {
      root: {
        color: "white"
      }
    }
  }
})


export default function Comment(props) {
  const { commentObj, handleSubmit, handleTxtFObjectChange, titleText, index, fromPage, subIndex } = props;
  const cName = fromPage === "reply" ? commentObj?.[index]?.[subIndex]?.name : commentObj?.name;
  const cComment = fromPage === "reply" ? commentObj?.[index]?.[subIndex]?.comment : commentObj?.comment;
  return (
    <MuiThemeProvider theme={theme}>
      <div className="d-flex-fdc main-bg padding-16 w-100">
        <div className="width-100 d-flex-fdc align-item-start padding-tb">{titleText}</div>
        <div className="width-100 d-flex-fdc padding-tb">
          <TextField
            placeholder="Name"
            type="text"
            value={cName}
            onChange={(event) => handleTxtFObjectChange("name", event, index)}
            variant="outlined"
            required={true}
          />
        </div>
        <div className="width-100 d-flex-fdc padding-tb">
          <TextField
            placeholder="Comment "
            type="text"
            value={cComment}
            onChange={(event) => handleTxtFObjectChange("comment", event, index)}
            variant="outlined"
            required={true}
          />
        </div>
        <div className="save-btn">
          <Button onClick={handleSubmit} style={{ backgroundColor: "royalblue" }}>POST</Button>
        </div>
      </div>
    </MuiThemeProvider>
  )
}
