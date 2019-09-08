import React from 'react';
import connect from "react-redux/es/connect/connect";

import style from './Chat.module.sass'


import Header from "./Header/Header";
import UserSearch from "./FindUsers/FindUsers";
import ConversationList from "./ConversationList/ConversationList";
import CurrentConversation from "./CurrentConversation/CurrentConversation";

import { isEqual } from 'lodash'
import { STAGE_OF_CHAT } from "../../constants/chatConst";

import { Field, reduxForm } from 'redux-form';


import { sendMessage, userStartsTyping, userStopTyping } from "../../api/socket/chatController";
import { CHAT_FIELDS, FORM } from "../../constants";


let ChatPage = (props) => {
    let typingTimer;

    const { handleSubmit, submitting, reset, resetSection} = props;
    const { stageNow, user } = props;


    const submit = (values) =>{
        if(values.message){
            const message = {
                time: Date.now(),
                ownerId: user.id,
                content: values.message
            };

            sendMessage(message);
            return reset()
        }
    };

    const keyUp = () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => userStopTyping(), 3000)
    };

    const keyDown = () => {
        userStartsTyping();
        clearTimeout(typingTimer);
    };

    return (
        <>
            <div className={style.chatContainer}>

                <Header resetField={() => resetSection(CHAT_FIELDS.FIND)}/>

                { isEqual(stageNow,STAGE_OF_CHAT.FIND_USERS) &&
                    <UserSearch fieldName={CHAT_FIELDS.FIND} resetField={resetSection}/>
                }
                { isEqual(stageNow,STAGE_OF_CHAT.BEGIN) &&
                    <ConversationList />
                }
                { isEqual(stageNow,STAGE_OF_CHAT.CONVERSATION) &&
                    <div className={style.currentConversation}>
                        <CurrentConversation />

                        <form onSubmit={handleSubmit(submit)} className={style.conversationForm}>
                            <div className={style.inputMessage}>
                                <Field name={CHAT_FIELDS.MESSAGE}
                                       component={'input'}
                                       type={'text'}
                                       placeholder="Write a message..."

                                       onKeyUp={keyUp}
                                       onKeyDown={keyDown}
                                />
                                <i className="far fa-grin-alt" />
                            </div>
                            <button type="submit" disabled={submitting} className={style.sendMessage}>
                                <i className="fas fa-paper-plane" />
                            </button>
                        </form>
                    </div>
                }

            </div>
        </>
    )
};

ChatPage = reduxForm ({
    form: FORM.CHAT,
})(ChatPage);

const mapStateToProps = (state) => ({
    user: state.userReducers.user,
    foundUsers: state.chatReducers.foundUsers,
    stageNow: state.chatReducers.stageNow,
});

export default connect(mapStateToProps)(ChatPage);


