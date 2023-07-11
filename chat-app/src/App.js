import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';
import {Routes,Route} from 'react-router-dom' 

function App() {
  return (
    <div className="App">
   <Routes>
    <Route path="/" element ={<HomePage/>}/>
    <Route path="/chats" element ={<ChatPage/>} exact/>

   </Routes>

    </div>
  );
}

export default App;
 