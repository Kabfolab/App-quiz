"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AddQuestion(){
  const [q, setQ] = useState("")
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const [c, setC] = useState("")
  const [d, setD] = useState("")
  const [correct, setCorrect] = useState("")

  async function handleAdd(){
    if(!q){ alert("Add question"); return; }
    const { error } = await supabase.from("questions").insert([{
      question: q,
      options: [a, b, c, d],
      correct: correct
    }])
    if(error) alert("Error: " + error.message)
    else { alert("Added!"); setQ(""); setA(""); setB(""); setC(""); setD(""); setCorrect("") }
  }

  return (
    <div style={{padding:20, maxWidth:500, margin:'auto'}}>
      <h2>Add Question</h2>
      <input placeholder="Question" value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%',padding:10,margin:5}}/>
      <input placeholder="Option A" value={a} onChange={e=>setA(e.target.value)} style={{width:'100%',padding:10,margin:5}}/>
      <input placeholder="Option B" value={b} onChange={e=>setB(e.target.value)} style={{width:'100%',padding:10,margin:5}}/>
      <input placeholder="Option C" value={c} onChange={e=>setC(e.target.value)} style={{width:'100%',padding:10,margin:5}}/>
      <input placeholder="Option D" value={d} onChange={e=>setD(e.target.value)} style={{width:'100%',padding:10,margin:5}}/>
      <input placeholder="Correct answer - copy exactly one option" value={correct} onChange={e=>setCorrect(e.target.value)} style={{width:'100%',padding:10,margin:5}}/>
      <button onClick={handleAdd} style={{width:'100%',padding:15,margin:10,background:'blue',color:'white'}}>Add</button>
    </div>
  )
}
