"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const ADMINS = [
  "idreesgoke@gmail.com",
  "idreesfolab@gmail.com"
]

export default function BulkAdd(){
  const [authChecked,setAuthChecked]=useState(false)
  const [subject,setSubject]=useState("pediatrics")
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
    try{
      let arr = JSON.parse(text.trim())
      if(!Array.isArray(arr)) arr = [arr]

      const questions = arr.map(q => {
        if(!q.question ||!q.options ||!q.correct) return null
        const opts = q.options.map(o=>o.trim()).filter(Boolean)
        if(opts.length < 2) return null
        // correct must match one option exactly
        if(!opts.includes(q.correct.trim())) return null

        return {
          question: q.question.trim(),
          options: opts,
          correct: q.correct.trim(),
          subject: (q.subject || subject).toLowerCase().trim()
        }
      }).filter(Boolean)

      if(questions.length===0){
        setLoading(false)
        return alert("No valid - Make sure format is: [{question, options: [...], correct: '...'}] and correct matches exactly one option")
      }

      const {error} = await supabase.from('questions').insert(questions)
      setLoading(false)
      if(error) return alert(error.message)
      alert(`Saved ${questions.length} to ${subject}`)
      setText("")
    } catch(e){
      setLoading(false)
      alert("JSON Error: " + e.message)
    }
  }

  if(!authChecked) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Checking admin...</div>

  return(
    <div style={{maxWidth:600,margin:'auto',padding:20,fontFamily:'sans-serif'}}>
      <a href="/" style={{textDecoration:'none'}}>← Home</a>
      <h2 style={{marginTop:10}}>Bulk Add - Admin Only</h2>
      <input list="subjects" value={subject} onChange={e=>setSubject(e.target.value.toLowerCase().trim())} style={{width:'100%',padding:'12px',borderRadius:'8px',border:'2px solid #667eea',marginBottom:10,marginTop:10}}/>
      <datalist id="subjects"><option value="obs-gynae"/><option value="pediatrics"/><option value="medicine"/><option value="surgery"/><option value="histopathology"/><option value="microbiology"/><option value="pharmacology"/></datalist>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder='Paste JSON e.g. [{"question":"...","options":["A","B","C","D"],"correct":"A"}]' style={{width:'100%',height:350,padding:12,borderRadius:8,border:'1px solid #ccc',fontFamily:'monospace'}}/>
      <button onClick={save} disabled={loading} style={{width:'100%',padding:14,background:'#16a34a',color:'white',border:'none',borderRadius:10,marginTop:10,fontWeight:'bold'}}>{loading?"Saving...":`SAVE TO ${subject.toUpperCase()}`}</button>
      <p style={{fontSize:12,marginTop:10,color:'#666'}}>Format: question + options array + correct must be exact match to one option</p>
    </div>
  )
}
