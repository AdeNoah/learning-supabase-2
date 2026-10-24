import { useState, type ChangeEvent, type FormEvent } from "react"
import supabase from '../subapase-client'


const Auth = () => {

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true)
    setStatusMessage('')
    setErrorMessage('')

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setErrorMessage(error.message)
          return
        }
        if (data.user?.identities?.length === 0) {
          setStatusMessage('An account already exists for this email. Switch to Sign In instead.')
        } else if (data.session) {
          setStatusMessage('Account created and signed in.')
        } else {
          setStatusMessage('Account created. Supabase requires email confirmation before sign-in. Check your spam folder; if no email arrives, check your project’s Auth email/SMTP settings.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setErrorMessage(error.message)
        }
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Authentication failed. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className='flex flex-col items-center gap-2 w-[60vw] max-w-[60vw] mb-4'>
        <h2 className="text-3xl font-bold mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2 w-full [&>input]:w-full [&>input]:bg-gray-600 [&>input]:text-white [&>input]:placeholder:text-gray-400 [&>input]:border [&>input]:border-gray-400 [&>input]:focus:outline-1 [&>input]:focus:outline-white"
        >
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300 active:cursor-pointer"
          >
            {isSubmitting ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        {errorMessage && (
          <p role="alert" className="text-red-300">{errorMessage}</p>
        )}
        {statusMessage && (
          <p role="status" className="text-green-300">{statusMessage}</p>
        )}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            setIsSignUp(!isSignUp);
            setStatusMessage('')
            setErrorMessage('')
          }}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
        </button>
      </div>
    </>
  )
}

export default Auth