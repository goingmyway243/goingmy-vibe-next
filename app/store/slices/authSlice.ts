import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
}

interface SignupData {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Software developer | Tech enthusiast | Coffee lover ☕',
    avatar: undefined,
    followers: ['2', '3'],
    following: ['2'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'janedoe',
    displayName: 'Jane Doe',
    bio: 'Designer & Creative | UX/UI enthusiast',
    avatar: undefined,
    followers: ['1'],
    following: ['1', '3'],
    createdAt: new Date('2024-02-20')
  }
];

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find mock user
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // In a real app, verify password here
      // For mock, accept any password
      
      // Store in localStorage
      localStorage.setItem('mockUser', JSON.stringify(foundUser));
      
      return foundUser;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if email already exists
      const existingUser = MOCK_USERS.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Check if username already exists
      const existingUsername = MOCK_USERS.find(u => u.username === data.username);
      if (existingUsername) {
        throw new Error('Username already taken');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        bio: '',
        followers: [],
        following: [],
        createdAt: new Date()
      };

      // Add to mock database
      MOCK_USERS.push(newUser);

      // Store in localStorage
      localStorage.setItem('mockUser', JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for loading user from localStorage
export const loadStoredUser = createAsyncThunk(
  'auth/loadStoredUser',
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        userData.createdAt = new Date(userData.createdAt);
        return userData;
      }
      return null;
    } catch (error) {
      localStorage.removeItem('mockUser');
      return rejectWithValue('Failed to parse stored user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('mockUser');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Load stored user
    builder.addCase(loadStoredUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadStoredUser.fulfilled, (state, action: PayloadAction<User | null>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(loadStoredUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
