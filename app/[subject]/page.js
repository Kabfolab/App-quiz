"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useParams } from "next/navigation"

export default function SubjectQuiz(){
  const { subject } = useParams()
  const [user,setUser]=useState(null)
  const [questions,setQuestions]=useState([])
  const [index,setIndex]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [answered,setAnswered]=useState({})

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user))
    if(subject){
      supabase.from('questions').select('*').eq('subject',subject).then(({data})=>setQuestions(data||[]))
    }
  },[subject])

  if(!user) return <div style={{padding:20}}><a href="/login">Login first</a></div>
  if(questions.length===0) return <div style={{padding:20}}>No questions for <b>{subject}</b>. <a href="/bulk-add">Add now</a> | <a href="/">Back</a></div>

  const q = questions[index]
  const handleSelect=(opt)=>{
    if(selected) return
    setSelected(opt)
    if(!answered[index]){
      if(opt===q.correct) setScore(s=>s+1)
      setAnswered({...answered,[index]:true})
    }
  }

  return(
    <div style={{maxWidth:600, margin:'auto', padding:15}}>
      <div style={{display:'flex', justifyContent:'space-between', background:'#f5f5f5', padding:10, borderRadius:8, marginBottom:15}}>
        <a href="/" style={{textDecoration:'none'}}>← Home</a>
        <b>{subject.toUpperCase()} | {score}/{questions.length}</b>
        <a href="/leaderboard">🏆</a>
      </div>
      <h3>Q{index+1}: {q.question}</h3>
      {q.options.map((opt,i)=>(
        <div key={i} onClick={()=>handleSelect(opt)} style={{
          background:!selected? '#fff' : opt===q.correct? 'green' : opt===selected? 'red' : '#eee',
          color:!selected? 'black' : opt===q.correct || opt===selected? 'white' : 'black',
          padding:12, margin:'8px 0', borderRadius:8, border:'1px solid #ddd', cursor:'pointer'
        }}>{opt}</div>
      ))}
      <div style={{display:'flex', gap:10, marginTop:20}}>
        <button disabled={index===0} onClick={()=>{setIndex(i=>i-1); setSelected(null)}}>Previous</button>
        {index < questions.length-1?
          <button onClick={()=>{setIndex(i=>i+1); setSelected(null)}}>Next</button> :
          <button style={{background:'black', color:'white', padding:'8px 15px'}} onClick={()=>alert(`Final ${score}/${questions.length}`)}>Finish</button>
        }
      </div>
    </div>
  )
}
