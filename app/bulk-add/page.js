"use client"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const ADMINS = [
  "idreesgoke@gmail.com",
  "kabfolab@gmail.com"
]

export default function BulkAdd(){
  const [authChecked,setAuthChecked]=useState(false)
  const [subject,setSubject]=useState("histopathology")
  const [text,setText]=useState("")
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      const user=data.session?.user
      if(!user){ window.location.href="/"; return }
      if(!ADMINS.map(e=>e.toLowerCase()).includes(user.email.toLowerCase())){
        alert("⛔ Not admin")
        window.location.href="/"
        return
      }
      setAuthChecked(true)
    })
  },[])

  async function save(){
    if(!text.trim()) return alert("Paste first")
    setLoading(true)
    const lines=text.split("\n")
    let questions=[], cur=null
    for(let l of lines){
      l=l.trim(); if(!l) continue
      if(/^\d+\./.test(l)){
        if(cur && cur.options.length>=2) questions.push(cur)
        cur={question:l.replace(/^\d+\.\s*/,""), options:[], correct:"", subject:subject.toLowerCase().trim()}
      } else if(/^[A-D][\.\)]/i.test(l)){
        cur?.options.push(l.replace(/^[A-D][\.\)]\s*/i,""))
      } else if(l.toLowerCase().startsWith("answer")){
        const letter=l.match(/[A-D]/i)?.[0]?.toUpperCase()
        if(cur && letter) cur.correct=cur.options[letter.charCodeAt(0)-65]
      }
    }
    if(cur && cur.options.length>=2) questions.push(cur)
    questions=questions.filter(q=>q.correct && q.options.includes(q.correct))
    if(questions.length===0){ setLoading(false); return alert("No valid") }
    const {error}=await supabase.from('questions').insert(questions)
    setLoading(false)
    if(error) return alert(error.message)
    alert(`Saved ${questions.length} to ${subject}`)
    setText("")
  }

  if(!authChecked) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Checking admin...</div>

  return(
    <div style={{maxWidth:600,margin:'auto',padding:20,fontFamily:'sans-serif'}}>
      <a href="/" style={{textDecoration:'none'}}>← Home</a>
      <h2 style={{marginTop:10}}>Bulk Add - Admin Only</h2>
      <input list="subjects" value={subject} onChange={e=>setSubject(e.target.value.toLowerCase().trim())} style={{width:'100%',padding:'12px',borderRadius:'8px',border:'2px solid #667eea',marginBottom:10,marginTop:10}}/>
      <datalist id="subjects"><option value="obs-gynae"/><option value="pediatrics"/><option value="medicine"/><option value="surgery"/><option value="histopathology"/><option value="microbiology"/><option value="pharmacology"/></datalist>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="1. Question?&#10;A...&#10;B...&#10;C...&#10;D...&#10;Answer: B" style={{width:'100%',height:300,padding:12,borderRadius:8,border:'1px solid #ccc'}}/>
      <button onClick={save} disabled={loading} style={{width:'100%',padding:14,background:'#16a34a',color:'white',border:'none',borderRadius:10,marginTop:10,fontWeight:'bold'}}>{loading?"Saving...":`SAVE TO ${subject.toUpperCase()}`}</button>
    </div>
  )
}
