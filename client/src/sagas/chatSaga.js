import React from 'react'
import CHAT_ACTION from "../actions/actionTypes/chatActionsTypes";

import { put, select } from 'redux-saga/effects';
import { cloneDeep, isEqual, last } from 'lodash'

import { toast } from 'react-toastify';
import ToastifyNewMessage from "../components/Toastify/ToastifyNewMessage";

import { STAGE_OF_CHAT, TYPE_OF_MESSAGE } from '../constants/chat'

import { joinToRoom } from "../api/socket/chatController";
import { openChat } from "../api/socket/chatController";

export function* closeOrOpenChatSaga({isOpen}) {
    try {
        if(!isOpen){
            openChat();

            const {chatConversationsReducer: { openConversation }} = yield select();

            if(openConversation){
                joinToRoom(openConversation._id)
            }
        }

        yield put({type: CHAT_ACTION.STATUS_OF_CHAT, isOpen: !isOpen});
    } catch (e) {
        yield put({type: CHAT_ACTION.CHAT_ERROR, error: e})
    }
}

export function* closeStageFindUsersSaga({nextStage}) {
    try {
        yield put({type: CHAT_ACTION.TO_NEXT_CHAT_STAGE, nextStage});
        yield put({type: CHAT_ACTION.CLEAR_FOUND_USERS});
    } catch (e) {
        yield put({type: CHAT_ACTION.CHAT_ERROR, error: e})
    }
}

export function* openConversationSaga() {
    try {
        yield put({type: CHAT_ACTION.TO_NEXT_CHAT_STAGE, nextStage: STAGE_OF_CHAT.CONVERSATION});
        yield put({type: CHAT_ACTION.CLEAR_FOUND_USERS});
    } catch (e) {
        yield put({type: CHAT_ACTION.CHAT_ERROR, error: e})
    }
}
export function* closeConversationSaga({openConversation}) {
    try {

        const {chatConversationsReducer: { conversations }, chatMessagesReducer: { messages }} = yield select();

        const newConversations = cloneDeep(conversations);
        newConversations.forEach( conversation => {
            if(isEqual(conversation._id, openConversation._id)){
                conversation[TYPE_OF_MESSAGE.LAST_MESSAGE] = last(messages);
            }
        });

        yield put({type: CHAT_ACTION.SHOW_CONVERSATIONS, conversations: newConversations});
        yield put({type: CHAT_ACTION.TO_NEXT_CHAT_STAGE, nextStage: STAGE_OF_CHAT.BEGIN});
        yield put({type: CHAT_ACTION.CLEAR_MESSAGES});
    } catch (e) {
        yield put({type: CHAT_ACTION.CHAT_ERROR, error: e})
    }
}

export function* addNewConversationSaga() {
    try {
        const {chatConversationsReducer: { conversations: oldConversations, openConversation }} = yield select();

        const newConversations = cloneDeep(oldConversations);
        newConversations.push(openConversation);

        yield put({type: CHAT_ACTION.ADD_CONVERSATION, conservations: newConversations});
    } catch (e) {
        yield put({type: CHAT_ACTION.CHAT_ERROR, error: e})
    }
}


export function* newMessageSaga({message}) {
    try {
        const {
            chatMessagesReducer: { messages: oldMessages },
            chatConversationsReducer: { openConversation, conversations: oldConversation },
            chatReducer: { isOpen }
        } = yield select();

        if(!isOpen){
            toast.info(<ToastifyNewMessage />, {
                position: toast.POSITION.TOP_RIGHT
            });
        }

        if(openConversation){
            const newMessages = cloneDeep(oldMessages);
            newMessages.push(message);

            yield put({type: CHAT_ACTION.ADD_MESSAGES, messages: newMessages});
        }else{
            const newConversations = cloneDeep(oldConversation);
            newConversations.forEach( conversation => {
                if(isEqual(conversation._id, message.conversationId)){
                    conversation[TYPE_OF_MESSAGE.LAST_MESSAGE] = { ...message, notRead: true};
                }
            });


            yield put({type: CHAT_ACTION.SHOW_CONVERSATIONS, conversations: newConversations});
        }

    } catch (e) {
        yield put({type: CHAT_ACTION.CHAT_ERROR, error: e})
    }
}