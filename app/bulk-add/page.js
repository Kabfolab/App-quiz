"use client"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function BulkAdd(){
  const [subject, setSubject] = useState("histopathology")
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  async function save(){
    if(!text.trim()) return alert("Paste questions first")
    setLoading(true)

    const lines = text.split("\n")
    let questions = []
    let cur = null

    for(let l of lines){
      l=l.trim()
      if(!l) continue
      if(/^\d+\./.test(l)){
        if(cur) questions.push(cur)
        cur = { question: l.replace(/^\d+\.\s*/, ""), options: [], correct: "", subject: subject.toLowerCase().trim() }
      } else if(/^[A-D][\.\)]/i.test(l)){
        cur?.options.push(l.replace(/^[A-D][\.\)]\s*/i, ""))
      } else if(l.toLowerCase().startsWith("answer")){
        const letter = l.match(/[A-D]/i)?.[0]?.toUpperCase()
        if(cur && letter) cur.correct = cur.options[letter.charCodeAt(0)-65]
      }
    }
    if(cur) questions.push(cur)

    const { error } = await supabase.from('questions').insert(questions)
    setLoading(false)
    if(error) return alert(error.message)
    alert(`Saved ${questions.length} to ${subject}`)
    setText("")
  }

  return(
    <div style={{maxWidth:600, margin:'auto', padding:20}}>
      <a href="/">← Home</a>
      <h2 style={{marginTop:10}}>Bulk Add</h2>

      <p style={{fontSize:13, fontWeight:'bold'}}>SUBJECT:</p>
      <input
        list="subjects"
        value={subject}
        onChange={e=>setSubject(e.target.value.toLowerCase().trim())}
        placeholder="histopathology"
        style={{width:'100%', padding:'12px', borderRadius:'8px', border:'2px solid #667eea', marginBottom:'10px', background:'white', display:'block'}}
      />
      <datalist id="subjects">
        <option value="obs-gynae" />
        <option value="pediatrics" />
        <option value="medicine" />
        <option value="surgery" />
        <option value="histopathology" />
        <option value="microbiology" />
        <option value="pharmacology" />
      </datalist>

      <textarea
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="1. What is..."
        style={{width:'100%', height:'300px', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}
      />

      <button onClick={save} style={{width:'100%', padding:'12px', background:'green', color:'white', border:'none', borderRadius:'8px', marginTop:'10px'}}>
        {loading? "Saving..." : `SAVE TO ${subject.toUpperCase()}`}
      </button>
    </div>
  )
}
