import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { auth, supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData?: { name?: string }) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ data: any; error: any }>
  updatePassword: (password: string) => Promise<{ data: any; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session } = await auth.getCurrentSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in to EVOLV.",
          })
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData?: { name?: string }) => {
    try {
      const result = await auth.signUp(email, password, userData)
      if (result.error) {
        toast({
          title: "Sign up failed",
          description: result.error.message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
      }
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await auth.signIn(email, password)
      if (result.error) {
        toast({
          title: "Sign in failed",
          description: result.error.message,
          variant: "destructive"
        })
      }
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      const result = await auth.signInWithOAuth(provider)
      if (result.error) {
        toast({
          title: "OAuth sign in failed",
          description: result.error.message,
          variant: "destructive"
        })
      }
      return result
    } catch (error) {
      console.error('OAuth sign in error:', error)
      toast({
        title: "OAuth sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const signOut = async () => {
    try {
      const result = await auth.signOut()
      if (result.error) {
        toast({
          title: "Sign out failed",
          description: result.error.message,
          variant: "destructive"
        })
      }
      return result
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const result = await auth.resetPassword(email)
      if (result.error) {
        toast({
          title: "Password reset failed",
          description: result.error.message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for password reset instructions.",
        })
      }
      return result
    } catch (error) {
      console.error('Password reset error:', error)
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const result = await auth.updatePassword(password)
      if (result.error) {
        toast({
          title: "Password update failed",
          description: result.error.message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        })
      }
      return result
    } catch (error) {
      console.error('Password update error:', error)
      toast({
        title: "Password update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
