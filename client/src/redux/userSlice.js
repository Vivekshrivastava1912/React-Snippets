import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
    _id : "" ,
    name : "" ,
    email : "",
    credit : "" ,
    mobile : "",
    verify_email : "",
    last_login_date : "",
    role: "", 
    loading: true,
}

const userSlice = createSlice({
    name : 'user',
    initialState : initialValue,
    reducers : {
        setUserDetails : (state, action) => {
            if (!action.payload) {
                state._id = "";
                state.name = "";
                state.email = "";
                state.credit = "";
                state.mobile = "";
                state.verify_email = "";
                state.last_login_date = "";
                state.role = "";
                state.loading = false;
                return;
            }
            state._id = action.payload?._id;
            state.name = action.payload?.name;
            state.email = action.payload?.email;
            state.credit = action.payload?.credit;
            state.mobile = action.payload?.mobile;
            state.verify_email = action.payload?.verify_email;
            state.last_login_date = action.payload?.last_login_date;
            state.role = action.payload?.role; 
            state.loading = false;
        },
        setLoading : (state, action) => {
            state.loading = action.payload;
        },
        updateCredit : (state, action) => {
            state.credit = action.payload;
        }
    }
})

export const { setUserDetails, setLoading, updateCredit } = userSlice.actions

export default userSlice.reducer