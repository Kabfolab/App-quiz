'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Add(){
  const [q,setQ]=useState(''); const [o1,setO1]=useState(''); const [o2,setO2]=useState(''); const [o3,setO3]=useState(''); const [o4,setO4]=useState(''); const [correct,setCorrect]=useState('')
  const add = async ()=>{ await supabase.from('questions').insert({ question: q, options: [o1,o2,o3,o4], correct }); alert('Added!') }
  return <div style={{maxWidth:'500px'}}><h2>Add Question (Anyone can add)</h2><input placeholder="Question" onChange={e=>setQ(e.target.value)} style={{width:'100%'}}/><input placeholder="Option 1" onChange={e=>setO1(e.target.value)}/><input placeholder="Option 2" onChange={e=>setO2(e.target.value)}/><input placeholder="Option 3" onChange={e=>setO3(e.target.value)}/><input placeholder="Option 4" onChange={e=>setO4(e.target.value)}/><input placeholder="Correct answer (exact text)" onChange={e=>setCorrect(e.target.value)}/><button onClick={add}>Add Question</button></div>
}
