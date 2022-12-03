import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { Transaction } from '../@types/transaction'
import { api } from '../lib/axios'

type CreateTransaction = Omit<Transaction, 'createdAt' | 'id'>

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => void
  createTRansaction: (data: CreateTransaction) => void
}

export const TransactionsContext = createContext({} as TransactionContextType)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  const createTRansaction = useCallback(async (data: CreateTransaction) => {
    const { description, price, category, type } = data

    const response = await api.post('transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    })

    setTransactions((state) => [response.data, ...state])
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTRansaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
