import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    'id' : 'src',
    'state': true
}

export const openFolderSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        openFolder: (state , action) =>{
            state.id = action.payload.id;
            state.state = action.payload.state;
        },
    }
})


export const {openFolder} = openFolderSlice.actions

export default openFolderSlice.reducer