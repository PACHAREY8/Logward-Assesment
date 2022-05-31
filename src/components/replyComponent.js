import React, { Component } from 'react'
import { TextField, Button } from '@material-ui/core';
import Comment from "./comment"
import Common from "./common"

export class ReplyComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      renderCommentSec: {},
      isEdit: {},
      subIndex: 0,
      commentArray: props?.commentArray || [],
      index: 0,
      isChildEdit: {},
      subIndex: 0,
      childEditState: {}
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const commentArray = JSON.parse(localStorage.getItem("commentObj"));
    if (prevState?.commentArray?.length !== commentArray?.length) {
      this.setState({
        commentArray
      })
    }
  }
  handleReply = (index) => {
    const { renderCommentSec, commentArray } = this.state;
    renderCommentSec[index] = true;
    commentArray[index]["child"].push({ name: "", comment: "", dateNTime: Common.returnDate() })
    this.setState({
      renderCommentSec,
      index,
      commentArray
    })
  }

  handleSubmit = () => {
    const { commentArray, subIndex, index, isEdit, renderCommentSec, isChildEdit } = this.state;
    let newArray = [];
    if (!isEdit[index]) {
      if (isChildEdit?.[index]?.[subIndex]) {
        newArray = [...commentArray]
        localStorage.setItem('commentObj', JSON.stringify(newArray));
        this.handleEdit(index, false, "reply", subIndex)
      } else {
        localStorage.setItem('commentObj', JSON.stringify([...commentArray]));
        renderCommentSec[index] = false
        this.setState({
          openSnackBar: true,
          snackBarMessage: "Comment added successfully!",
          renderCommentSec
        });
      }
    } else {
      newArray = [...commentArray]
      localStorage.setItem('commentObj', JSON.stringify(newArray));
      this.handleEdit(index, false, "comment")
    }
  }

  handleTxtFObjectChange = (type, event, index) => {
    const { commentArray, subIndex } = this.state;
    let length = commentArray[index]["child"].length;
    commentArray[index]["child"][length - 1][type] = event.target.value;
    this.setState({
      ...commentArray,
      subIndex: length,
      index
    })
  }

  renderReplySection = (index) => {
    const { commentArray, subIndex } = this.state;
    return (
      <div className="margin-tb width-80 d-flex-fdc">
        <Comment commentObj={commentArray} handleSubmit={this.handleSubmit} handleTxtFObjectChange={this.handleTxtFObjectChange} titleText="Reply" index={index} fromPage="reply" subIndex={subIndex} />
      </div>
    )
  }

  renderRdoView = (child, type, index) => {
    const { renderCommentSec, commentArray, isEdit, isChildEdit } = this.state;
    child = renderCommentSec[index] ? child.slice(0, -1) : child
    return child?.map((key, subIndex) => {
      const { name = "", comment = "", dateNTime = null } = key || {};
      const [date, time] = dateNTime?.split("T") || "";
      return (<div key={time} className="margin-tb width-80 d-flex-fdc">
        <div className="main-bg margin-tb padding-16 d-flex-fdc align-item-start">
          <div className='padding-b-14 font-600 d-flex justify-between width-100'><span>{name}</span>
            <span>
              {date}
            </span>
          </div>
          <div className='d-flex justify-between width-100'>
            {!isChildEdit?.[index]?.[subIndex] ? <div className='font-normal padding-b-14'>{comment}</div> : this.editCommentTextInput(commentArray, index, type, subIndex)}
            <img
              src={require("../Icons/delete.png")}
              alt="delete"
              className='delete-icon'
              onClick={() => this.handleDeleteComment(index, type, subIndex)}
            />
          </div>
          {!isChildEdit?.[index]?.[subIndex] ? <div >
            <span className="btn font-14" onClick={() => this.handleEdit(index, true, "reply", subIndex)} >Edit</span>
          </div> : <div className="save-btn">
            <Button onClick={this.handleSubmit} style={{ backgroundColor: "royalblue" }}>UPDATE</Button>
          </div>}
        </div>
      </div>)
    })
  }

  handleeditCommentChange = (index, event, type, subIndex) => {
    let { commentArray } = this.state;
    if (type === "comment") {
      commentArray[index]["comment"] = event.target.value
    } else {
      commentArray[index]["child"][subIndex]["comment"] = event.target.value
    }
    this.setState({
      commentArray,
      index,
      subIndex
    })
  }

  editCommentTextInput = (commentArray, index, type, subIndex) => {
    const { comment } = type === "comment" ? commentArray[index] : commentArray[index]["child"][subIndex];
    return (
      <div className="width-98 d-flex-fdc padding-tb">
        <TextField
          placeholder="Comment"
          type="text"
          value={comment}
          onChange={(event) => this.handleeditCommentChange(index, event, type, subIndex)}
          variant="outlined"
          required={true}
        />
      </div>
    )
  }

  handleEdit = (mIndex, bool, type, sIndex) => {
    let { isEdit, isChildEdit, childEditState } = this.state;
    if (type === "comment") {
      isEdit[mIndex] = bool;
    } else {
      childEditState[sIndex] = bool;
      isChildEdit[mIndex] = childEditState
    }
    this.setState({
      isEdit,
      index: type === "comment" && mIndex,
      subIndex: type === "reply" && mIndex,
      isChildEdit
    })
  }
  handleDeleteComment = (currentIndex, type, subIndex) => {
    const { commentArray, index } = this.state;
    if (type === "comment") {
      if (commentArray.length > 1) {
        commentArray.splice(currentIndex, 1)
        localStorage.setItem('commentObj', JSON.stringify([...commentArray]));;
      } else {
        localStorage.clear()
      }
    } else {
      commentArray[currentIndex]["child"].splice(subIndex, 1)
      localStorage.setItem('commentObj', JSON.stringify([...commentArray]));;
    }
    this.setState({ commentArray })
  }
  renderParentUI = (commentArray, type) => {
    const { renderCommentSec, isEdit } = this.state;
    return commentArray?.map((key, index) => {
      const { name = "", comment = "", dateNTime = null } = key || {};
      const [date, time] = dateNTime?.split("T") || "";
      let { child } = commentArray[index] || {};
      return (
        <div key={`${time}-comments`}>
          <div className="main-bg margin-tb padding-16 d-flex-fdc align-item-start">
            <div className='padding-b-14 font-600 d-flex justify-between width-100'><span>{name}</span>
              <span>
                {date}
              </span>
            </div>
            <div className='d-flex justify-between width-100'>
              {!isEdit[index] ? <div className='font-normal padding-b-14'>{comment}</div> : this.editCommentTextInput(commentArray, index, type)}
              <img
                src={require("../Icons/delete.png")}
                alt="delete"
                className='delete-icon'
                onClick={() => this.handleDeleteComment(index, type)}
              />
            </div>
            {!isEdit[index] ? <div >
              {type !== "reply" && <span className="btn font-14 padding-r-6" onClick={() => this.handleReply(index)} >Reply</span>}
              <span className="btn font-14" onClick={() => this.handleEdit(index, true, "comment")} >Edit</span>
            </div> : <div className="save-btn">
              <Button onClick={this.handleSubmit} style={{ backgroundColor: "royalblue" }}>UPDATE</Button>
            </div>}
          </div>
          {(renderCommentSec[index] && type === "comment") && <div className='d-flex justify-cont-end'>{this.renderReplySection(index)}</div>}
          {!!child?.length && <div className='d-flex-fdc justify-cont-end align-item-end'>{this.renderRdoView(child, "reply", index)}</div>}
        </div>
      )
    })
  }
  sortArray = () => {
    const { commentArray } = this.state;
    this.setState({
      commentArray: Common.sortDateNTIme(commentArray)
    })
  }

  render() {
    const { commentArray } = this.state;
    return (
      <div>
        {!!commentArray.length &&
          <div className='d-flex justify-cont-end padding-t-14 cursor-pointer' onClick={this.sortArray}>Sort By: Date and Time <img
            src={require("../Icons/down-arrow.png")}
            alt="sort"
            className='down-arrow'
          /></div>}
        {!!commentArray.length && this.renderParentUI(commentArray, "comment")}
      </div>
    )
  }
}

export default ReplyComponent

