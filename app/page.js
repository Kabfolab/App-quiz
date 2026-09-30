"use client"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const ICONS = {
  "obs-gynae": "♀️", 
  "pediatrics": "🍼", 
  "medicine": "💊", 
  "surgery": "✂️",
  "histopathology": "🔬", 
  "microbiology": "🦠", 
  "pharmacology": "💊", 
  "default": "📚"
}
const COLORS = {
  "obs-gynae": "#ec4899", 
  "pediatrics": "#3b82f6", 
  "medicine": "#f59e0b",
  "surgery": "#ef4444",
  "histopathology": "#a855f7",
  "microbiology": "#10b981", 
  "default": "#667eea"
}

export default function Home(){
  const [user,setUser]=useState(null)
  const [subjects,setSubjects]=useState([])

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user))
    supabase.from('questions').select('subject').then(({data})=>{
      if(!data) return
      const counts = {}
      data.forEach(r=>{ counts[r.subject] = (counts[r.subject]||0)+1 })
      const list = Object.entries(counts).map(([name,count])=>({name,count}))
      setSubjects(list)
    })
  },[])

  async function logout(){ await supabase.auth.signOut(); location.href="/login" }

  if(user===null) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div style={{background:'white', padding:40, borderRadius:20, textAlign:'center', maxWidth:380, width:'90%'}}>
        <div style={{fontSize:50}}>🩺</div><h1>MedQuiz Pro</h1>
        <a href="/login" style={{display:'block', background:'#667eea', color:'white', padding:14, borderRadius:10, textDecoration:'none', fontWeight:'bold'}}>Log In</a>
        <a href="/signup" style={{display:'block', background:'#f3f4f6', color:'#333', padding:14, borderRadius:10, textDecoration:'none', marginTop:10}}>Sign Up</a>
      </div>
    </div>
  )

  return(
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'15px 20px', display:'flex', justifyContent:'space-between', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <b>🩺 MedQuiz Pro</b>
        <div><span style={{fontSize:12, marginRight:10}}>{user?.email}</span><button onClick={logout} style={{background:'#ef4444', color:'white', border:'none', padding:'8px 12px', borderRadius:8}}>Logout</button></div>
      </div>
      <div style={{maxWidth:800, margin:'auto', padding:20}}>
        <h2>Choose Subject 👇</h2>
        <p style={{color:'#6b7280'}}>Auto-detected from database</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginTop:20}}>
          {subjects.map(s=>(
            <a key={s.name} href={`/${s.name}`} style={{textDecoration:'none', background:'white', borderRadius:16, padding:20, borderTop:`4px solid ${COLORS[s.name]||COLORS.default}`, boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
              <div style={{fontSize:28}}>{ICONS[s.name]||ICONS.default}</div>
              <h3 style={{margin:'10px 0 5px', color:'#1f2937', textTransform:'capitalize'}}>{s.name.replace('-',' & ')}</h3>
              <p style={{fontSize:12, color:COLORS[s.name]||COLORS.default, fontWeight:'bold'}}>{s.count} Questions</p>
            </a>
          ))}
        </div>
        <div style={{marginTop:20}}>
          <a href="/bulk-add" style={{background:'#667eea', color:'white', padding:'12px 18px', borderRadius:10, textDecoration:'none'}}>＋ Add New Subject / Questions</a>
          <a href="/leaderboard" style={{marginLeft:10, background:'white', padding:'12px 18px', borderRadius:10, textDecoration:'none', border:'1px solid #ddd'}}>🏆 Leaderboard</a>
        </div>
      </div>
    </div>
  )
}
