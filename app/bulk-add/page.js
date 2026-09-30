"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

export const dynamic = 'force-dynamic'

export default function BulkAdd(){
  const [text,setText]=useState("")
  const [loading,setLoading]=useState(false)
  
  async function handleBulk(){
    setLoading(true)
    try{
      const questions = JSON.parse(text)
      const {error} = await supabase.from("questions").insert(questions)
      if(error) alert("Error: "+error.message)
      else alert("Added "+questions.length+" questions!")
    }catch(e){ alert("JSON error: "+e.message) }
    setLoading(false)
  }

  return(
    <div style={{padding:20,maxWidth:600,margin:'auto'}}>
      <h2>AI Bulk Add - Ten Teachers Ch.10</h2>
      <textarea value={text} onChange={e=>setText(e.target.value)} 
        placeholder='[{"question":"...","options":["A","B","C","D"],"correct":"A"}]'
        style={{width:'100%',height:300,padding:10}}/>
      <button onClick={handleBulk} disabled={loading}
        style={{width:'100%',padding:15,background:'green',color:'white',marginTop:10}}>
        {loading?"Adding...":"Add All Questions"}
      </button>
      <a href="/" style={{display:'block',marginTop:20}}>Back to Quiz</a>
    </div>
  )
}
