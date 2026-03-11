"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PointsTransaction {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  type: 'EARNED' | 'REDEEMED';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  earnedAt?: string;
}

interface PointsContextType {
  points: number;
  loading: boolean;
  transactions: PointsTransaction[];
  achievements: Achievement[];
  fetchPoints: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchAchievements: () => Promise<void>;
  redeemPoints: (rewardId: string, cost: number) => Promise<void>;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const fetchPoints = async () => {
    try {
      const response = await fetch('/api/points/balance');
      if (!response.ok) throw new Error('Failed to fetch points');
      const data = await response.json();
      setPoints(data.balance || 0);
    } catch (error) {
      console.error('Error fetching points:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/points/history');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/points/achievements');
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const data = await response.json();
      setAchievements(data.achievements || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const redeemPoints = async (rewardId: string, cost: number) => {
    try {
      const response = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });
      if (!response.ok) throw new Error('Failed to redeem points');
      
      setPoints(prev => prev - cost);
      await fetchTransactions();
    } catch (error) {
      console.error('Error redeeming points:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider
      value={{
        points,
        loading,
        transactions,
        achievements,
        fetchPoints,
        fetchTransactions,
        fetchAchievements,
        redeemPoints,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
