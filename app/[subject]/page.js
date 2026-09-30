"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useParams } from "next/navigation"

export default function SubjectQuiz(){
  const { subject } = useParams()
  const [questions,setQuestions]=useState([])
  const [index,setIndex]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [answered,setAnswered]=useState({})
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(subject){
      // try to find questions - handles both "obs-gynae" and "Obs & Gynae"
      const decoded = decodeURIComponent(subject)
      supabase.from('questions').select('*').eq('subject',decoded).then(({data})=>{
        if(data && data.length>0){
          setQuestions(data)
        } else {
          // fallback: try ilike
          supabase.from('questions').select('*').ilike('subject', decoded).then(({data: d2})=>{
            setQuestions(d2||[])
          })
        }
        setLoading(false)
      })
    }
  },[subject])

  if(loading) return <div style={{padding:40,textAlign:'center'}}>Loading {subject}...</div>
  if(questions.length===0) return <div style={{padding:20}}>No questions for <b>{subject}</b>. <a href="/bulk-add">Add now</a> | <a href="/">Back</a></div>

  const q = questions[index]
  // Support both DB formats: options array OR option_a/b/c
  const options = q.options || [q.option_a, q.option_b, q.option_c, q.option_d, q.option_e].filter(Boolean)
  const correctAns = q.correct || q.correct_answer

  const handleSelect=(opt)=>{
    if(selected) return
    setSelected(opt)
    if(!answered[index]){
      if(opt===correctAns) setScore(s=>s+1)
      setAnswered({...answered,[index]:true})
    }
  }

  return(
    <div style={{maxWidth:600, margin:'auto', padding:15, fontFamily:'sans-serif'}}>
      <div style={{display:'flex', justifyContent:'space-between', background:'#f5f5f5', padding:10, borderRadius:8, marginBottom:15}}>
        <a href="/" style={{textDecoration:'none'}}>← Home</a>
        <b>{decodeURIComponent(subject).toUpperCase()} | {score}/{questions.length}</b>
        <a href="/leaderboard">🏆</a>
      </div>
      <h3>Q{index+1}: {q.question}</h3>
      {options.map((opt,i)=>(
        <div key={i} onClick={()=>handleSelect(opt)} style={{
          background:!selected? '#fff' : opt===correctAns? '#16a34a' : opt===selected? '#ef4444' : '#eee',
          color:!selected? 'black' : opt===correctAns || opt===selected? 'white' : 'black',
          padding:12, margin:'8px 0', borderRadius:8, border:'1px solid #ddd', cursor:'pointer'
        }}>{opt}</div>
      ))}
      {q.explanation && selected && <div style={{background:'#f0f9ff', padding:10, borderRadius:8, marginTop:10, fontSize:13}}><b>Explanation:</b> {q.explanation}</div>}
      <div style={{display:'flex', gap:10, marginTop:20}}>
        <button disabled={index===0} onClick={()=>{setIndex(i=>i-1); setSelected(answered[i-1]? questions[i-1].correct || questions[i-1].correct_answer : null)}}>Previous</button>
        {index < questions.length-1?
          <button onClick={()=>{setIndex(i=>i+1); setSelected(null)}}>Next</button> :
          <button style={{background:'black', color:'white', padding:'8px 15px', borderRadius:8}} onClick={()=>alert(`Final ${score}/${questions.length}`)}>Finish</button>
        }
      </div>
    </div>
  )
}
