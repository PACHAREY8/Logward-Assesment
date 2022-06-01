import React, { Component } from 'react';
import ReplyComponent from './replyComponent';
import Comment from './comment';
import Common from "./common"
import { Button, Snackbar } from '@material-ui/core';

export class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentObj: { name: "", comment: "", dateNTime: null, child: [] },
            openSnackBar: false,
            commentArray: JSON.parse(localStorage.getItem("commentObj")) || [],
            snackBarMessage: ""
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const commentArray = JSON.parse(localStorage.getItem("commentObj")) || [];
        if (prevState?.commentArray?.length !== commentArray?.length) {
            this.setState({
                commentArray
            })
        }
    }

    handleTxtFObjectChange = (type, event) => {
        const { commentObj } = this.state;
        let state = commentObj[type] = event.target.value;
        state = commentObj["dateNTime"] = Common.returnDate(),
            this.setState({
                state
            })
    }
    handleSubmit = () => {
        const { commentObj } = this.state;
        const { name = "", comment = "", dateNTime = null } = commentObj
        if (name === "") {
            this.setState({
                openSnackBar: true,
                snackBarMessage: "Please Enter Name Field."
            })
        }
        else if (comment === "") {
            this.setState({
                openSnackBar: true,
                snackBarMessage: "Please Enter Comment."
            })
        } else {
            const commentArray = JSON.parse(localStorage.getItem("commentObj")) || [];
            const newArray = commentArray !== null ? [...commentArray, ...[commentObj]] : [commentObj];

            localStorage.setItem('commentObj', JSON.stringify(newArray));
            this.setState({
                openSnackBar: true,
                snackBarMessage: "Comment added successfully!",
                commentObj: {
                    name: "", comment: "", dateNTime: null, child: []
                },
            });
        }
    }
    handleSnackClose = () => {
        this.setState({
            openSnackBar: false
        })
    }
    render() {
        const { commentObj = [], commentArray = [], snackBarMessage, openSnackBar } = this.state;
        return (
            <div className='margin-auto width-60 d-flex-fdc'>
                <Comment commentObj={commentObj} handleSubmit={this.handleSubmit} handleTxtFObjectChange={this.handleTxtFObjectChange} titleText="Comment" />
                {!!commentArray?.length && <ReplyComponent commentArray={commentArray} />}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={openSnackBar}
                    autoHideDuration={1500}
                    onClose={this.handleSnackClose}
                    variant="error"
                    message={<span> {snackBarMessage} </span>}
                    action={[
                        <div key="undo">
                            <Button key="undo" color="primary" size="small" onClick={this.handleSnackClose}>
                                OK
                            </Button>
                        </div>
                    ]}
                />
            </div>
        )

    }
}

export default Index
