"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function BulkAdd(){
  const [text,setText]=useState("")
  const [loading,setLoading]=useState(false)
  
  async function handleBulk(){
    setLoading(true)
    try{
      const questions = JSON.parse(text)
      const {error} = await supabase.from("questions").insert(questions)
      if(error) alert("Error: "+error.message)
      else alert(`Added ${questions.length} questions!`)
    }catch(e){ alert("JSON error: "+e.message) }
    setLoading(false)
  }

  return(
    <div style={{padding:20,maxWidth:600,margin:'auto'}}>
      <h2>AI Bulk Add</h2>
      <p>Paste JSON array below and click Add All</p>
      <textarea value={text} onChange={e=>setText(e.target.value)} 
        placeholder='[{"question":"2+2?","options":["3","4","5","6"],"correct":"4"}]'
        style={{width:'100%',height:300,padding:10}}/>
      <button onClick={handleBulk} disabled={loading}
        style={{width:'100%',padding:15,background:'green',color:'white',marginTop:10}}>
        {loading?"Adding...":"Add All Questions"}
      </button>
      
      <div style={{marginTop:20,background:'#eee',padding:10}}>
        <b>Prompt to copy to ChatGPT / Meta AI:</b><br/>
        Generate 20 math questions about integers like 7+(-)8. 
        Return ONLY JSON array like this: 
        [{"question":"...","options":["...","...","...","..."],"correct":"..."}]
        Correct must exactly equal one option.
      </div>
    </div>
  )
}
