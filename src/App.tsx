import TaskManager from './components/TaskManager';
import Auth from './components/Auth'
import supabase from './subapase-client';
import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';



const App = () => {

    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Keep the UI in sync when Supabase restores a session or auth changes.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, nextSession) => {
                setSession(nextSession);
            }
        );

        // Stop listening when this component unmounts.
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    
    return (

        <>

            <div className='bg-gray-700 h-screen vw-screen text-white flex flex-col items-center'>
                {session ? (
                    <>
                        <TaskManager session={session} />
                        <button className="bg-red-500 mb-8 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300" 
                        onClick={() => supabase.auth.signOut()}
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <Auth />    
                )}

            </div>


        </>

    );
};

export default App;
