import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/auth';

jest.mock('../../services/auth');

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    
    jest.clearAllMocks();
  });

  test('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.loading).toBe(true);
  });

  test('should login successfully', async () => {
    const mockUser = { id: 'user123', name: 'Test User' };
    const mockToken = 'test-token';
    authService.login.mockResolvedValue({ user: mockUser, token: mockToken });
    
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    
    act(() => {
      result.current.login('test@example.com', 'password123');
    });
    
    await waitForNextUpdate();
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.loading).toBe(false);
    
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  test('should handle login failure', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    
    act(() => {
      result.current.login('test@example.com', 'wrongpassword');
    });
    
    await waitForNextUpdate();
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.loading).toBe(false);
    
    expect(localStorage.getItem('token')).toBe(null);
    expect(localStorage.getItem('user')).toBe(null);
  });

  test('should logout correctly', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 'user123' }));
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    
    expect(localStorage.getItem('token')).toBe(null);
    expect(localStorage.getItem('user')).toBe(null);
  });
});