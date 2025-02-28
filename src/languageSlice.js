import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from './i18next/i18n.js'; // i18next faylingiz

const languageSlice = createSlice({
  name: "language",
  initialState: {
    selectedLanguage: "O'zbek", // Default til
  },
  reducers: {
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
      i18next.changeLanguage(action.payload); // i18next tilini o'zgartirish
      AsyncStorage.setItem("selectedLanguage", action.payload); // AsyncStorage ga saqlash
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;