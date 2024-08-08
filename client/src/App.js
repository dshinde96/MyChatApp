import './Style.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './UserAuth/Login';
import Signup from './UserAuth/Signup';
import { ChatState } from './context/chatContext';
import ProtectedHomeRoute from './Components/ProtectedHomeRoute';

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<ProtectedHomeRoute />}>
          <Route exact path='/' key="Home" element={<ChatState><Home /></ChatState>} />
        </Route>
        <Route exact path='/login' key="Login" element={<Login />} />
        <Route exact path='/signup' key="Signup" element={<Signup />} />
      </Routes>
    </>
  )
}
export default App;
