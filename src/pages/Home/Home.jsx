import React from 'react'
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Feed from '../../Components/Feed/Feed'
const Home = ({sidebar, category, setCategory}) => {
  return (
    <>
    <Sidebar sidebar={sidebar} category={category} setCategory={setCategory}/>
    
    <div className={`container ${sidebar ? "" : "large-container"}`}>

        <Feed category={category}/>
    </div>
    </>
    
      

  )
}

export default Home
