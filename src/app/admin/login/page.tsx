import { redirect } from 'next/navigation'
import { getSession } from '../../../admin/auth'
import { LoginForm } from '../../../components/studio/LoginForm'

export default async function StudioLoginPage() {
  const session = await getSession()
  if (session) redirect('/admin')

  return (
    <div className="bg-canvas grid min-h-screen place-items-center p-6">
      <LoginForm />
    </div>
  )
}
