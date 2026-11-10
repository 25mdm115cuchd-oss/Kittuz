import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Address } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  toggleAdminRole: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-default-1',
  fullName: 'Ananya Deshmukh',
  email: 'ananya.d@example.com',
  phone: '+91 98201 44521',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  createdAt: '2026-01-15T10:00:00Z',
  savedAddresses: [
    {
      id: 'addr-1',
      fullName: 'Ananya Deshmukh',
      phone: '+91 98201 44521',
      street: 'Flat 402, Sea Pearl Residences, Bandra West',
      landmark: 'Near Carter Road Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      addressType: 'home',
      isDefault: true
    },
    {
      id: 'addr-2',
      fullName: 'Ananya Deshmukh',
      phone: '+91 98201 44521',
      street: 'Tower B, 14th Floor, One World Tech Park, Lower Parel',
      landmark: 'Opposite Palladium Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      addressType: 'work',
      isDefault: false
    }
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kittuz_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('kittuz_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('kittuz_user');
      }
    } catch (e) {
      console.error('Failed to sync user state', e);
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    // Authenticate user
    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: email.includes('admin') ? 'admin' : 'customer'
    };
    setUser(loggedUser);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const googleUser: UserProfile = {
      id: `google-${Date.now()}`,
      email: 'ananya.deshmukh@gmail.com',
      fullName: 'Ananya Deshmukh',
      phone: '+91 98201 44521',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString(),
      savedAddresses: DEFAULT_USER.savedAddresses
    };
    setUser(googleUser);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: name,
      email,
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      savedAddresses: []
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleAdminRole = () => {
    if (!user) {
      setUser({ ...DEFAULT_USER, role: 'admin' });
      return;
    }
    setUser(prev => prev ? { ...prev, role: prev.role === 'admin' ? 'customer' : 'admin' } : null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  const addAddress = (addrData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...addrData,
      id: `addr-${Date.now()}`,
      isDefault: user.savedAddresses.length === 0 || addrData.isDefault
    };

    let updatedList = [...user.savedAddresses];
    if (newAddress.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    }
    updatedList.push(newAddress);

    setUser({ ...user, savedAddresses: updatedList });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (!user) return;
    let list = user.savedAddresses.map(a => a.id === id ? { ...a, ...updates } : a);
    if (updates.isDefault) {
      list = list.map(a => a.id === id ? a : { ...a, isDefault: false });
    }
    setUser({ ...user, savedAddresses: list });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const remaining = user.savedAddresses.filter(a => a.id !== id);
    if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    setUser({ ...user, savedAddresses: remaining });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const list = user.savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setUser({ ...user, savedAddresses: list });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        loginWithGoogle,
        register,
        logout,
        toggleAdminRole,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
