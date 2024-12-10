import { useEffect } from 'react'
import { BACKEND_URL, useSession } from '../../SessionContext'
import { useNavigate } from 'react-router-dom'

const Backend = () => {
    const navigate = useNavigate()
    const {user} = useSession();
    useEffect(() => {
        if (!user){
            navigate("/Login")
            return;
        }
    },[])
  return (
    <div>
        <div>
            <h1>RESTFUL API (MUST BE LOGGED IN TO WORK)</h1>
            <h4>Example Body</h4>
            <p>{"{\"user\": {\"username\": \"myusername\"}, task: todotaskhere, completed: true}"}</p>
        </div>
        <div className='backend'>

            <div>
                <h2>CREATE: (POST)</h2> 
                <div>
                    <h3>{BACKEND_URL + "/todos"}</h3>
                    <p>Create a new todo</p>
                    <p>BODY = task, user</p>
                </div>
            </div>
            <div>
                <h2>READ: (POST)</h2> 
                <div>
                    <h3>{BACKEND_URL + "/todos/all"}</h3>
                    <h4>Read all todos of a user</h4>
                    <p>BODY = user</p>
                </div>
            </div>
            
            <div>
                <h2>UPDATE: (POST)</h2> 
                <div>
                    <h3>{BACKEND_URL + "/todos" + "/:id"}</h3>
                    <h4>Update an existing todo</h4>
                    <p>id = id of the updating todo</p>
                    <p>BODY = task, completed</p>
                </div>
            </div>
            <div>
                <h2>Delete: (POST)</h2> 
                <div>
                    <h3>{BACKEND_URL + "/todos" + "/:id"}</h3>
                    <h4>Delete an existing todo</h4>
                    <p>id = id of the updating todo</p>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Backend
