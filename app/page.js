'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Quiz() {
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState({}) // fixes 22/21 bug

  useEffect(() => {
    supabase.auth.getUser().then(({data})=> setUser(data.user))
    supabase.from('questions').select('*').then(({data})=> setQuestions(data || []))
  }, [])

  if(!user) return <div style={{padding:20}}><a href="/login">Please Login first</a></div>

  if(questions.length===0) return (
    <div style={{padding:20, maxWidth:600, margin:'auto'}}>
      <h2>No questions yet</h2>
      <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
        <a href="/add-question" style={{background:'blue',color:'white',padding:'10px 15px',textDecoration:'none',borderRadius:5}}> + Add Question</a>
        <a href="/bulk-add" style={{background:'green',color:'white',padding:'10px 15px',textDecoration:'none',borderRadius:5}}>Bulk AI Add</a>
      </div>
    </div>
  )

  const q = questions[index]

  const handleSelect = (opt) => {
    if(selected) return
    setSelected(opt)
    if(!answered[index]){
      if(opt === q.correct) setScore(s=>s+1)
      setAnswered({...answered, [index]: true})
    }
  }

  const saveScore = async () => {
    await supabase.from('scores').insert({ user_id: user.id, email: user.email, score })
    alert('Score saved!')
  }

  const colorClass = (opt) => {
    if(!selected) return { background: '#fff', border: '1px solid #ccc', padding: '12px', margin: '8px 0', cursor: 'pointer', borderRadius:5 }
    if(opt === q.correct) return { background: 'green', color: 'white', padding: '12px', margin: '8px 0', borderRadius:5 }
    if(opt === selected && opt!== q.correct) return { background: 'red', color: 'white', padding: '12px', margin: '8px 0', borderRadius:5 }
    return { background: '#eee', padding: '12px', margin: '8px 0', borderRadius:5 }
  }

  return (
    <div style={{maxWidth:'600px', margin:'auto', padding:'15px'}}>

      {/* HEADER BUTTONS - FIXED */}
      <div style={{background:'#f5f5f5', padding:'10px', borderRadius:8, marginBottom:15, display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center'}}>
        <span style={{fontWeight:'bold', flexBasis:'100%', marginBottom:5}}>Score: {score} / {questions.length}</span>
        <a href="/add-question" style={{background:'#2563eb',color:'white',padding:'8px 12px',textDecoration:'none',borderRadius:5, fontSize:'14px'}}>Add Question</a>
        <a href="/bulk-add" style={{background:'#16a34a',color:'white',padding:'8px 12px',textDecoration:'none',borderRadius:5, fontSize:'14px'}}>Bulk AI Add</a>
        <a href="/leaderboard" style={{color:'#2563eb', fontSize:'14px'}}>Leaderboard</a>
      </div>

      <h3>Q{index+1}: {q.question}</h3>
      {q.options.map((opt,i)=>(
        <div key={i} style={colorClass(opt)} onClick={()=>handleSelect(opt)}>{opt}</div>
      ))}

      <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
        <button disabled={index===0} onClick={()=>{setIndex(i=>i-1); setSelected(null)}} style={{padding:'8px 15px'}}>Previous</button>
        {index < questions.length-1?
          <button onClick={()=>{setIndex(i=>i+1); setSelected(null)}} style={{padding:'8px 15px'}}>Next</button> :
          <button onClick={()=>setShowResult(true)} style={{padding:'8px 15px', background:'black', color:'white'}}>Finish</button>
        }
      </div>
      {showResult && <div style={{marginTop:20, borderTop:'1px solid #ccc', paddingTop:10}}><h2>Final Score: {score}</h2><button onClick={saveScore} style={{padding:'8px 15px'}}>Save My Score</button> <a href="/leaderboard" style={{marginLeft:10}}>Leaderboard</a></div>}
    </div>
  )
}
