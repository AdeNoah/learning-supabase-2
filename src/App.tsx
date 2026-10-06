import { useState, useEffect } from 'react';
import supabase from './subapase-client'; 
import type { Task }  from './types';

type NewTask = Omit<Task, 'id' | 'created_at'>;

const App = () => {

    const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '' });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [updatedDescription, setupdatedDescription] = useState<string>('')

    // to read a task
    const fetchTasks = async () => {
        const {error, data} = await supabase
            .from('tasks')
            .select('*') 
            .order('created_at', {ascending: true});
        
        if(error) {
            console.log(`Error fetching tasks: ${error.message} `)
            return
        }

        setTasks(data)
    }

    // to create a task
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const {error} = await supabase
            .from('tasks')
            .insert(newTask)
        
        if(error) {
            console.error(`Error adding task: ${error.message}`)
        } else {
            setNewTask({title: '', description:''})
            await fetchTasks()
        }
    }

    // to update a task
    const handleUpdate = async (id:number, updatedTask: NewTask) => {
        const {data, error} = await supabase
            .from('tasks')
            .update(updatedTask)
            .eq('id', id)   

        if(error) {
            console.log(`Error updating task: ${error.message}`)
        } else {
            setupdatedDescription('')
            return data
        }
    }

    // to delete a task
    const handleDelete = async(id:number) => {
        const {error} = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)

        if(error) {
            console.log(`Error deleting task ${error.message}`)
            return;
        }
    }



    useEffect(() => {
        fetchTasks();
    }, [])

console.log(tasks)

  return (
    
    <>
        <div className='bg-gray-700 h-screen vw-screen text-white flex flex-col items-center'>
            <h2 className='text-3xl font-bold mb-4'>Task Manager CRUD</h2>

            {/* form to add a new task */}
            <form onSubmit={handleSubmit} 
                className='flex flex-col items-center gap-2 w-[60vw] max-w-[60vw] mb-4'
            >
                <input type="text" 
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className='w-full bg-gray-600 text-white placeholder:text-gray-400 border border-gray-400 focus:outline-1 focus:outline-white'
                placeholder='Task title'
                />
                <textarea name="" id="" 
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className='w-full bg-gray-600 text-white placeholder:text-gray-400 border border-gray-400 focus:outline-1 focus:outline-white'
                placeholder='Task description'
                />
                <button className='w-fit mt-2 bg-black/50 p-3 px-8 rounded-[15px] cursor-pointer hover:outline active:opacity-80'>
                    Add Task
                </button>
            </form>

            {/* lists of tasks */}
              <ul>
                  {tasks.map((task) => {
                      return (
                          <li key={task.id} className="mb-4">
                              <div className="border w-[60vw] max-w-[60vw] flex flex-col items-center p-8">
                                  <h3>{task.title}</h3>
                                  <p>{task.description}</p>
                                  <div className="flex gap-8 [&>button]:p-3 [&>button]:px-4 [&>button]:rounded-[15px] [&>button]:cursor-pointer [&>button]:bg-black/50 mt-2 [&>button]:hover:outline [&>button]:active:opacity-80"
                                  >
                                      <textarea 
                                      value={updatedDescription}
                                      className='w-half bg-gray-600 text-white placeholder:text-gray-400 border border-gray-400 focus:outline-1 focus:outline-white' placeholder='updated description' 
                                      onChange={(e) => setupdatedDescription(e.target.value)} />

                                      <button onClick={() => handleUpdate(task.id, {title: task.title, description: updatedDescription})}>
                                          Edit
                                      </button>

                                      <button onClick={() => handleDelete(task.id)}>
                                          Delete
                                      </button>
                                  </div>
                              </div>
                          </li>
                      )
                  })}

              </ul>
        </div>

        
    </>

    );
};

export default App;
