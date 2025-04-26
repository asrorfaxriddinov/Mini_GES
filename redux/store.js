// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme Slice
const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: false,
  },
  reducers: {
    toggleMode(state) {
      state.isDarkMode = !state.isDarkMode;
      AsyncStorage.setItem('theme', JSON.stringify({ isDarkMode: state.isDarkMode })).catch(
        (error) => console.error('Failed to save theme to AsyncStorage:', error)
      );
    },
    setTheme(state, action) {
      state.isDarkMode = action.payload;
    },
  },
});

// Minigs12 Slice
const minigs12Slice = createSlice({
  name: 'minigs12',
  initialState: {
    value: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setMinigs12Start(state) {
      state.loading = true;
      state.error = null;
    },
    setMinigs12Success(state, action) {
      state.value = action.payload;
      state.loading = false;
    },
    setMinigs12Failure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { toggleMode, setTheme } = themeSlice.actions;
export const { setMinigs12Start, setMinigs12Success, setMinigs12Failure } = minigs12Slice.actions;

// Store konfiguratsiyasi
const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    minigs12: minigs12Slice.reducer,
  },
});

// Boshlang'ich holatni AsyncStorage'dan yuklash
const loadTheme = async () => {
  try {
    const savedTheme = await AsyncStorage.getItem('theme');
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      store.dispatch(setTheme(parsedTheme.isDarkMode));
    }
  } catch (error) {
    console.error('Failed to load theme from AsyncStorage:', error);
  }
};

// Ilova ochilganda bir marta yuklash
loadTheme();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;