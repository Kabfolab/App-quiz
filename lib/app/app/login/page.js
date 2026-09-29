'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const signUp = async ()=>{ const {error}=await supabase.auth.signUp({email,password}); alert(error?error.message:'Check email to confirm!') }
  const signIn = async ()=>{ const {error}=await supabase.auth.signInWithPassword({email,password}); if(!error) window.location.href='/' }
  return <div><h2>Login / Register</h2><input placeholder="email" onChange={e=>setEmail(e.target.value)}/><input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/><button onClick={signIn}>Login</button><button onClick={signUp}>Register</button></div>
}
