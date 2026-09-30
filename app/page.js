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

  useEffect(() => {
    supabase.auth.getUser().then(({data})=> setUser(data.user))
    supabase.from('questions').select('*').then(({data})=> setQuestions(data || []))
  }, [])

  if(!user) return <a href="/login">Please Login first</a>
  if(questions.length===0) return <p>Loading questions... add some at /add-question</p>

  const q = questions[index]

  const handleSelect = (opt) => {
    if(selected) return
    setSelected(opt)
    if(opt === q.correct) setScore(s=>s+1)
  }

  const saveScore = async () => {
    await supabase.from('scores').insert({ user_id: user.id, email: user.email, score })
    alert('Score saved!')
  }

  const colorClass = (opt) => {
    if(!selected) return { background: '#fff', border: '1px solid #ccc', padding: '10px', margin: '5px 0', cursor: 'pointer' }
    if(opt === q.correct) return { background: 'green', color: 'white', padding: '10px', margin: '5px 0' }
    if(opt === selected && opt!== q.correct) return { background: 'red', color: 'white', padding: '10px', margin: '5px 0' }
    return { background: '#eee', padding: '10px', margin: '5px 0' }
  }

  return (
    <div style={{maxWidth:'600px', margin:'auto'}}>
      <h2>Score: {score} / {questions.length}</h2>
      <a href="/add-question" style={{background:'blue',color:'white',padding:'5px 10px',textDecoration:'none'}}>Add Question</a>
      <a href="/bulk-add" style={{background:'green',color:'white',padding:'5px 10px',marginLeft:10,textDecoration:'none'}}>Bulk AI Add</a>
      <h3>Q{index+1}: {q.question}</h3>
      {q.options.map((opt,i)=>(
        <div key={i} style={colorClass(opt)} onClick={()=>handleSelect(opt)}>{opt}</div>
      ))}
      <div style={{marginTop:'20px'}}>
        <button disabled={index===0} onClick={()=>{setIndex(i=>i-1); setSelected(null)}}>Previous</button>
        {index < questions.length-1?
          <button onClick={()=>{setIndex(i=>i+1); setSelected(null)}} style={{marginLeft:'10px'}}>Next</button> :
          <button onClick={()=>setShowResult(true)} style={{marginLeft:'10px'}}>Finish</button>
        }
      </div>
      {showResult && <div><h2>Final Score: {score}</h2><button onClick={saveScore}>Save My Score</button> <a href="/leaderboard">Leaderboard</a></div>}
    </div>
  )
    }
