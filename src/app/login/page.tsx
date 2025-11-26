import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Login Page
export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">ログイン</CardTitle>
                    <CardDescription>
                        メールアドレスとパスワードを入力してください。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <Button formAction={login} className="w-full">ログイン</Button>
                            <Button formAction={signup} variant="outline" className="w-full">新規登録</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
