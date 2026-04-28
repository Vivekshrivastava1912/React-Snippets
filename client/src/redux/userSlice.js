import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
    _id : "" ,
    name : "" ,
    email : "",
    credit : "" ,
    mobile : "",
    verify_email : "",
    last_login_date : "",
   
}

const userSlice = createSlice({
    name : 'user',
    initialState : initialValue,
    reducers : {
        setUserDetails : (state, action) => {
            state._id = action.payload?._id;
            state.name = action.payload?.name;
            state.email = action.payload?.email;
            state.credit = action.payload?.credit;
            state.avatar = action.payload?.avatar;
            state.mobile = action.payload?.mobile;
            state.verify_email = action.payload?.verify_email;
            state.last_login_date = action.payload?.last_login_date;
           
        }
    }
})

export const { setUserDetails } = userSlice.actions

export default userSlice.reducer