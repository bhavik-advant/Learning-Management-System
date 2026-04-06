import { SignIn } from "@clerk/nextjs";


function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
        <SignIn />
    </div>
  )
}

export default SignUpPage;