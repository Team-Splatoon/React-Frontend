export const host = 'http://localhost:4000'
// pre-create all routes where corresponding controllers are at, which will be used to handle all types of requests
export const signupRoute = `${host}/api/auth/signup`
export const loginRoute = `${host}/api/auth/login`
export const setAvatarRoute = `${host}/api/auth/setavatar`
export const allUsersRoute = `${host}/api/auth/allusers`
export const sendMessageRoute = `${host}/api/message/addmsg`
export const getAllMessagesRoute = `${host}/api/message/getmsg`
export const fetchAllChatsRoute = `${host}/api/chat`
export const createGroupChatRoute = `${host}/api/chat/group`
export const renameGroupChatRoute = `${host}/api/chat/rename`
export const removepplGroupChatRoute = `${host}/api/chat/groupremove`
export const addpplGroupChatRoute = `${host}/api/chat/groupadd`
export const autoCreateGroupChatRoute = `${host}/api/chat/autocreate`
export const fetchAllGroupChatsRoute = `${host}/api/chat/fetchGroupChats`
