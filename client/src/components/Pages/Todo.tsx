// Todo.tsx
import React, { useState, useEffect } from 'react';
import { useSession, BACKEND_URL } from '../../SessionContext';

const API_URL = BACKEND_URL + "/todos";
interface TodoType{
    username: string
    task: string
    completed: boolean
    _id: string
}
const Todo: React.FC = () => {
  const { user } = useSession();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<TodoType | null>(null);
  // Fetch todos for the user when logged in
  useEffect(() => {
    if (user) {
        getTodos()
    }
  }, [user]);
  const getTodos = () => {
    fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send cookies with the request
      })
        .then((response) => response.json())
        .then((data) => {
            const sortedTodos = data.sort((a: { completed: boolean }, b: { completed: boolean }) => {
                return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            });
            setTodos(sortedTodos);    
        })
        .catch(() => setError('Failed to load todos'));
  }
  // Handle adding a new todo
  const handleAddTodo = async () => {
    if (!newTask.trim()) return;
  
    const newTodo = { task: newTask, completed: false, username: user?.username || '' };
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
        credentials: 'include',
      });
  
      // Log the status code and response text
      const responseText = await response.text();
      console.log('Status Code:', response.status);
      console.log('Response Text:', responseText);
  
      if (!response.ok) {
        throw new Error(`Failed to create todo: ${responseText}`);
      }
  
      // Try to parse the response as JSON
    //   let createdTodo;
    //   try {
    //     createdTodo = JSON.parse(responseText);
    //   } catch (jsonError) {
    //     throw new Error('Response is not valid JSON');
    //   }
  
      getTodos()
      setNewTask('');
    } catch (err : any) {
      setError(`Failed to create todo: ${err.message}`);
    }
  };
  
  

  // Handle completing a todo
  const handleUpdateTodo = async (id: string, task: string, completed: boolean) => {
    console.log("Updating todo:", { id, task, completed });
    try {
        // Check if inputs are valid
        if (!task) {
            setError("Task cannot be empty");
            return;
        }

        // Log the request for debugging purposes
        console.log("Updating todo:", { id, task, completed });

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: task, completed: completed }),
            credentials: 'include',
        });

        // Check if the response was successful
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.message || 'Failed to update todo');
        }
        // Fetch the updated todos list after updating
        getTodos();

    } catch (err) {
        console.error('Error during update:', err);
        setError('Failed to update todo');
    }
};

  const handleEditTodo = async (todo : TodoType) => {
    setCurrentTodo(todo)
    setIsPopupOpen(true)
  }
  // Handle deleting a todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter((todo) => todo._id !== id));
      getTodos()
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <div
        className='d-flex flex-column justify-content-center align-items-center gap-4'
    >
      <h2>Todos for {user.username}</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
        
      <ul
        className='d-flex flex-column justify-content-center align-items-center gap-5'
      >
        {todos.map((todo) => (
          <li 
          key={todo._id} 
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          className='d-flex flex-column gap-2 justify-content-center align-items-center todo'
          >
            <div className='d-flex gap-2'>
                <h3>{todo.task}</h3>
                <button 
                onClick={() => handleUpdateTodo(todo._id,  todo.task,!todo.completed)}
                className={todo.completed ? "active" : "red"}
                >{!todo.completed ? "Incomplete!" : "Completed!"}</button>
            </div>
            <div>
                <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
                <button onClick={() => handleEditTodo(todo)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
      {isPopupOpen && currentTodo && (
                <TodoEditPopup 
                    todo={currentTodo}
                    onClose={() => setIsPopupOpen(false)}
                    onUpdate={handleUpdateTodo}
                />
       )}
    </div>
  );
};
interface TodoEditMPopupProps {
    todo: { _id: string; task: string; completed: boolean };
    onClose: () => void;
    onUpdate: (id: string, updatedTask: string, updatedComplete : boolean) => void;
}

const TodoEditPopup : React.FC<TodoEditMPopupProps> = ({ todo, onClose, onUpdate }) => {
    const [task, setTask] = useState(todo.task);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            onUpdate(todo._id, task, todo.completed); // Update the todo
            onClose(); // Close the modal after update
        } catch (error) {
            console.error("Error updating todo", error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Edit Todo</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={task}
                        onChange={handleChange}
                        placeholder="Update task"
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default Todo;
