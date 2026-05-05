import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ background: '#F5F0E8' }}>
      <SignUp routing="hash" />
    </main>
  )
}