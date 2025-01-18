import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../store'
import { loginThunk, logout } from '../store/authSlice'

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const authState = useSelector((state: RootState) => state.auth)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await dispatch(loginThunk(credentials)).unwrap()
      navigate('/dashboard')
    } catch (error) {
      // Error handling is done in the slice
      throw error
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    login,
    logout: handleLogout
  }
}