import { useState, useEffect } from 'react';
import authService from '../services/auth';
import { validateLogin } from '../utils/validators';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.initialize();
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();
        
        setUser(currentUser);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Validate credentials
      const validation = validateLogin(credentials);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      const { user: loggedInUser } = await authService.login(credentials);
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      
      // Force navigation to dashboard
      window.location.href = '/dashboard';
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const hasPermission = (permission) => {
    const result = authService.canPerform(permission);
    console.log(`🔍 Checking permission '${permission}':`, {
      result,
      user,
      userRole: user?.role,
      isAuthenticated
    });
    return result;
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  const isCashier = () => {
    return authService.isCashier();
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    isAdmin,
    isCashier,
  };
};