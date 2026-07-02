import { Outlet } from 'react-router-dom'
import './AppLayout.css' // Import corretto senza "styles"
import Sidebar from '../components/sidebar/Sidebar'
import Navbar from '../components/navbar/Navbar'

function AppLayout() {
  return (
    <div className="screenContainer">
      
      <Sidebar />

      <div className="rightContentWrapper">
        
       <Navbar />

        {/*area dinamica*/}
        <main className="pageDynamicArea">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AppLayout