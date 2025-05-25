export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">Тестовая страница</h1>
      <p className="text-xl">Если вы видите эту страницу, сервер работает правильно!</p>
      <div className="mt-8 p-4 bg-primary/10 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Проверка стилей</h2>
        <p>Этот блок должен иметь цветной фон</p>
      </div>
    </div>
  )
}
