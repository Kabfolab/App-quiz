"use client"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

// ADD MORE EMAILS HERE - anyone here can add questions
const ADMINS = [
  "your_email@gmail.com",
  "second_admin@gmail.com"
]

export default function AddQuestion(){
  const [authChecked,setAuthChecked]=useState(false)
  const [subject,setSubject]=useState("histopathology")
  const [q,setQ]=useState("")
  const [a,setA]=useState("")
  const [b,setB]=useState("")
  const [c,setC]=useState("")
  const [d,setD]=useState("")
  const [correct,setCorrect]=useState("A")
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      const user=data.session?.user
      if(!user){ window.location.href="/"; return }
      if(!ADMINS.map(e=>e.toLowerCase()).includes(user.email.toLowerCase())){
        alert("⛔ Not admin - you can only take quiz")
        window.location.href="/"
        return
      }
      setAuthChecked(true)
    })
  },[])

  async function handleAdd(){
    if(!subject.trim()) return alert("Enter subject")
    if(!q.trim()||!a.trim()||!b.trim()||!c.trim()||!d.trim()) return alert("Fill all")
    setLoading(true)
    const map={A:a.trim(),B:b.trim(),C:c.trim(),D:d.trim()}
    const {error}=await supabase.from("questions").insert([{
      question:q.trim(), options:[a.trim(),b.trim(),c.trim(),d.trim()],
      correct:map[correct], subject:subject.toLowerCase().trim()
    }])
    setLoading(false)
    if(error) return alert(error.message)
    alert(`Added to ${subject}!`)
    setQ(""); setA(""); setB(""); setC(""); setD("")
  }

  if(!authChecked) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Checking admin...</div>

  return (
    <div style={{maxWidth:500,margin:'auto',padding:20,fontFamily:'sans-serif'}}>
      <a href="/" style={{textDecoration:'none',fontSize:14}}>← Home</a>
      <h2 style={{marginTop:10}}>Manual Add ✍️ (Admin Only)</h2>
      <input list="subjects" value={subject} onChange={e=>setSubject(e.target.value.toLowerCase().trim())} style={{width:'100%',padding:'12px',borderRadius:8,border:'2px solid #667eea',marginTop:10,boxSizing:'border-box'}}/>
      <datalist id="subjects"><option value="obs-gynae"/><option value="pediatrics"/><option value="medicine"/><option value="surgery"/><option value="histopathology"/><option value="microbiology"/><option value="pharmacology"/></datalist>
      <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Question" style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #d1d5db',marginTop:10,minHeight:80,boxSizing:'border-box'}}/>
      <input value={a} onChange={e=>setA(e.target.value)} placeholder="Option A" style={{width:'100%',padding:12,marginTop:8,borderRadius:8,border:'1px solid #d1d5db',boxSizing:'border-box'}}/>
      <input value={b} onChange={e=>setB(e.target.value)} placeholder="Option B" style={{width:'100%',padding:12,marginTop:8,borderRadius:8,border:'1px solid #d1d5db',boxSizing:'border-box'}}/>
      <input value={c} onChange={e=>setC(e.target.value)} placeholder="Option C" style={{width:'100%',padding:12,marginTop:8,borderRadius:8,border:'1px solid #d1d5db',boxSizing:'border-box'}}/>
      <input value={d} onChange={e=>setD(e.target.value)} placeholder="Option D" style={{width:'100%',padding:12,marginTop:8,borderRadius:8,border:'1px solid #d1d5db',boxSizing:'border-box'}}/>
      <select value={correct} onChange={e=>setCorrect(e.target.value)} style={{width:'100%',padding:12,marginTop:10,borderRadius:8}}><option value="A">Correct = A</option><option value="B">Correct = B</option><option value="C">Correct = C</option><option value="D">Correct = D</option></select>
      <button onClick={handleAdd} disabled={loading} style={{width:'100%',padding:14,marginTop:15,background:'#667eea',color:'white',border:'none',borderRadius:10,fontWeight:'bold'}}>{loading?"Adding...":`Add to ${subject.toUpperCase()}`}</button>
    </div>
  )
}
