"use client"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function AddQuestion(){
  const [subject,setSubject]=useState("histopathology")
  const [q,setQ]=useState("")
  const [a,setA]=useState("")
  const [b,setB]=useState("")
  const [c,setC]=useState("")
  const [d,setD]=useState("")
  const [correct,setCorrect]=useState("A")
  const [loading,setLoading]=useState(false)

  async function handleAdd(){
    if(!subject.trim()) return alert("Enter subject")
    if(!q.trim() ||!a.trim() ||!b.trim() ||!c.trim() ||!d.trim()) return alert("Fill question and all 4 options")
    setLoading(true)
    const map={A:a.trim(), B:b.trim(), C:c.trim(), D:d.trim()}
    const {error}=await supabase.from("questions").insert([{
      question: q.trim(),
      options: [a.trim(), b.trim(), c.trim(), d.trim()],
      correct: map[correct],
      subject: subject.toLowerCase().trim()
    }])
    setLoading(false)
    if(error) return alert(error.message)
    alert(`Added to ${subject}!`)
    setQ(""); setA(""); setB(""); setC(""); setD("")
  }

  return (
    <div style={{maxWidth:500, margin:'auto', padding:20, fontFamily:'sans-serif'}}>
      <a href="/" style={{textDecoration:'none', fontSize:14}}>← Home</a>
      <h2 style={{marginTop:10}}>Manual Add Question ✍️</h2>
      <p style={{fontSize:12, color:'#6b7280'}}>Adds 1 by 1 to your subject</p>

      <label style={{fontSize:12, fontWeight:'bold', marginTop:15, display:'block'}}>SUBJECT</label>
      <input list="subjects" value={subject} onChange={e=>setSubject(e.target.value.toLowerCase().trim())} placeholder="e.g. obs-gynae" style={{width:'100%', padding:'12px', borderRadius:8, border:'2px solid #667eea', marginTop:5, boxSizing:'border-box', background:'white'}}/>
      <datalist id="subjects">
        <option value="obs-gynae" />
        <option value="pediatrics" />
        <option value="medicine" />
        <option value="surgery" />
        <option value="histopathology" />
        <option value="microbiology" />
        <option value="pharmacology" />
      </datalist>

      <label style={{fontSize:12, fontWeight:'bold', marginTop:15, display:'block'}}>QUESTION</label>
      <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Type question here..." style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #d1d5db', marginTop:5, minHeight:80, boxSizing:'border-box'}}/>

      <label style={{fontSize:12, fontWeight:'bold', marginTop:15, display:'block'}}>OPTIONS</label>
      <input value={a} onChange={e=>setA(e.target.value)} placeholder="Option A" style={{width:'100%', padding:12, marginTop:8, borderRadius:8, border:'1px solid #d1d5db', boxSizing:'border-box'}}/>
      <input value={b} onChange={e=>setB(e.target.value)} placeholder="Option B" style={{width:'100%', padding:12, marginTop:8, borderRadius:8, border:'1px solid #d1d5db', boxSizing:'border-box'}}/>
      <input value={c} onChange={e=>setC(e.target.value)} placeholder="Option C" style={{width:'100%', padding:12, marginTop:8, borderRadius:8, border:'1px solid #d1d5db', boxSizing:'border-box'}}/>
      <input value={d} onChange={e=>setD(e.target.value)} placeholder="Option D" style={{width:'100%', padding:12, marginTop:8, borderRadius:8, border:'1px solid #d1d5db', boxSizing:'border-box'}}/>

      <label style={{fontSize:12, fontWeight:'bold', marginTop:15, display:'block'}}>CORRECT ANSWER</label>
      <select value={correct} onChange={e=>setCorrect(e.target.value)} style={{width:'100%', padding:12, marginTop:5, borderRadius:8, border:'1px solid #d1d5db', background:'white'}}>
        <option value="A">A is Correct</option>
        <option value="B">B is Correct</option>
        <option value="C">C is Correct</option>
        <option value="D">D is Correct</option>
      </select>

      <button onClick={handleAdd} disabled={loading} style={{width:'100%', padding:14, marginTop:20, background:'#667eea', color:'white', border:'none', borderRadius:10, fontWeight:'bold', cursor:'pointer', fontSize:15}}>
        {loading? "Adding..." : `Add to ${subject.toUpperCase()}`}
      </button>

      <div style={{marginTop:15, display:'flex', gap:10}}>
        <a href="/bulk-add" style={{fontSize:12, color:'#667eea'}}>Need AI bulk? → Bulk Add</a>
      </div>
    </div>
  )
}
