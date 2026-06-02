import { createClient } from '@/lib/supabase/server'
import type { Expense, ExpenseInsert, ExpenseUpdate } from '@/lib/types'

export interface ExpenseFilters {
  search?: string
  month?: string
  source?: string
  receipt?: string
  currency?: string
}

export async function getExpenses(filters: ExpenseFilters = {}): Promise<Expense[]> {
  const supabase = await createClient()
  let query = supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.search) {
    const term = `%${filters.search}%`
    query = query.or(`merchant.ilike.${term},notes.ilike.${term}`)
  }
  if (filters.month) {
    query = query
      .gte('expense_date', `${filters.month}-01`)
      .lte('expense_date', `${filters.month}-31`)
  }
  if (filters.source && filters.source !== 'all') {
    query = query.eq('source', filters.source)
  }
  if (filters.receipt === 'has') {
    query = query.not('receipt_image_path', 'is', null)
  } else if (filters.receipt === 'none') {
    query = query.is('receipt_image_path', null)
  }
  if (filters.currency && filters.currency !== 'all') {
    query = query.eq('currency', filters.currency)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getExpense(id: string): Promise<Expense | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createExpense(expense: ExpenseInsert): Promise<Expense> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...expense, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateExpense(id: string, updates: ExpenseUpdate): Promise<Expense> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}
