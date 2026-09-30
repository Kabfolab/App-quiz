"use client"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

const ICONS = { "obs-gynae": "♀️", "pediatrics": "🍼", "medicine": "💊", "surgery": "✂️", "histopathology": "🔬", "microbiology": "🦠", "pharmacology": "💊", "default": "📚" }
const COLORS = { "obs-gynae": "#ec4899", "pediatrics": "#3b82f6", "medicine": "#f59e0b", "surgery": "#ef4444", "histopathology": "#a855f7", "microbiology": "#10b981", "default": "#667eea" }

// ADD THIS
const ADMINS = ["idreesfolab@gmail.com", "idreesgoke@gmail.com"]

export default function Home(){
  const [user,setUser]=useState(null)
  const [subjects,setSubjects]=useState([])
  const [loading,setLoading]=useState(true)
  const [isLogin,setIsLogin]=useState(true)
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [authLoading,setAuthLoading]=useState(false)
  const router = useRouter() // ADD THIS

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setUser(data.session?.user||null)
      setLoading(false)
    })
    supabase.from('questions').select('subject').then(({data})=>{
      if(!data) return
      const counts={}
      data.forEach(r=>{ counts[r.subject]=(counts[r.subject]||0)+1 })
      setSubjects(Object.entries(counts).map(([name,count])=>({name,count})))
    })
  },[])

  async function handleAuth(){
    if(!email || !pass) return alert("Fill all")
    setAuthLoading(true)
    const clean = email.toLowerCase().trim()
    if(isLogin){
      const {error}=await supabase.auth.signInWithPassword({email:clean,password:pass})
      if(error){ alert(error.message); setAuthLoading(false); return }
      const {data}=await supabase.auth.getSession()
      setUser(data.session?.user)
    } else {
      const {error}=await supabase.auth.signUp({email:clean,password:pass})
      setAuthLoading(false)
      if(error) return alert(error.message)
      alert("Account created! Now login")
      setIsLogin(true)
      return
    }
    setAuthLoading(false)
  }

  async function logout(){ await supabase.auth.signOut(); setUser(null) }

  if(loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>

  if(!user) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',fontFamily:'sans-serif'}}>
      <div style={{background:'white',padding:35,borderRadius:20,maxWidth:380,width:'90%',boxShadow:'0 20px 60px rgba(0,0,0,0.3)',textAlign:'center'}}>
        <div style={{fontSize:50}}>🩺</div><h2 style={{margin:'10px 0'}}>MedQuiz Pro</h2>
        <p style={{color:'#6b7280',fontSize:14,marginBottom:20}}>{isLogin?"Login to continue":"Create account"}</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%',padding:'14px',margin:'8px 0',borderRadius:10,border:'1px solid #d1d5db',boxSizing:'border-box'}}/>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" style={{width:'100%',padding:'14px',margin:'8px 0',borderRadius:10,border:'1px solid #d1d5db',boxSizing:'border-box'}}/>
        <button onClick={handleAuth} disabled={authLoading} style={{width:'100%',padding:'14px',marginTop:15,background:isLogin?'#667eea':'#16a34a',color:'white',border:'none',borderRadius:10,fontWeight:'bold',cursor:'pointer'}}>
          {authLoading?"Please wait...":isLogin?"Log In":"Sign Up"}
        </button>
        <p style={{fontSize:13,marginTop:15}}>{isLogin?"No account? ":"Have account? "}<span onClick={()=>setIsLogin(!isLogin)} style={{color:'#667eea',fontWeight:'bold',cursor:'pointer'}}>{isLogin?"Sign Up":"Log In"}</span></p>
      </div>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'sans-serif'}}>
      <div style={{background:'white',padding:'15px 20px',display:'flex',justifyContent:'space-between',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <b>🩺 MedQuiz Pro</b><div><span style={{fontSize:11,marginRight:8}}>{user.email}</span><button onClick={logout} style={{background:'#ef4444',color:'white',border:'none',padding:'6px 10px',borderRadius:8}}>Logout</button></div>
      </div>
      <div style={{maxWidth:800,margin:'auto',padding:20}}>
        
        {/* ADMIN BUTTONS - ONLY YOU SEE THIS */}
        {ADMINS.includes(user.email) && (
          <div style={{display:'flex',gap:10,marginBottom:20}}>
            <button onClick={()=>router.push('/add-question')} style={{background:'#3b82f6',color:'white',border:'none',padding:'10px 16px',borderRadius:10,fontWeight:'bold',cursor:'pointer'}}> + Add Question</button>
            <button onClick={()=>router.push('/bulk-add')} style={{background:'#10b981',color:'white',border:'none',padding:'10px 16px',borderRadius:10,fontWeight:'bold',cursor:'pointer'}}> Bulk Add</button>
          </div>
        )}

        <h2>Choose Subject 👇</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:15,marginTop:20}}>
          {subjects.map(s=>(
            <a key={s.name} href={`/${s.name}`} style={{textDecoration:'none',background:'white',borderRadius:16,padding:20,borderTop:`4px solid ${COLORS[s.name]||COLORS.default}`,boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
              <div style={{fontSize:28}}>{ICONS[s.name]||ICONS.default}</div><h3 style={{margin:'10px 0 5px',color:'#1f2937',textTransform:'capitalize'}}>{s.name.replace('-',' & ')}</h3><p style={{fontSize:12,color:COLORS[s.name]||COLORS.default,fontWeight:'bold'}}>{s.count} Questions</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
