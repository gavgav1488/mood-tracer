export default function TermsPage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Условия использования</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead">
          Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
        </p>
        
        <h2>1. Принятие условий</h2>
        <p>
          Используя Дневник настроения, вы соглашаетесь с настоящими условиями использования. Если вы не согласны с какой-либо частью условий, вы не можете использовать наш сервис.
        </p>
        
        <h2>2. Изменения условий</h2>
        <p>
          Мы оставляем за собой право изменять эти условия в любое время. Мы уведомим вас о любых изменениях, разместив новые условия на этой странице.
          Продолжая использовать сервис после внесения изменений, вы соглашаетесь с новыми условиями.
        </p>
        
        <h2>3. Учетная запись пользователя</h2>
        <p>
          Для использования некоторых функций нашего сервиса вам необходимо создать учетную запись. Вы несете ответственность за сохранение конфиденциальности своей учетной записи и за все действия, которые происходят под вашей учетной записью.
        </p>
        
        <h2>4. Контент пользователя</h2>
        <p>
          Вы сохраняете все права на контент, который вы создаете в Дневнике настроения. Однако, используя наш сервис, вы предоставляете нам неисключительную лицензию на использование, хранение и обработку этого контента для целей предоставления и улучшения сервиса.
        </p>
        
        <h2>5. Запрещенное поведение</h2>
        <p>
          При использовании нашего сервиса вы соглашаетесь не:
        </p>
        <ul>
          <li>Нарушать любые законы или правила.</li>
          <li>Выдавать себя за другого человека или организацию.</li>
          <li>Вмешиваться в работу сервиса или пытаться получить доступ к нему с использованием метода, отличного от интерфейса и инструкций, которые мы предоставляем.</li>
          <li>Использовать сервис для распространения вредоносного программного обеспечения или для сбора информации о других пользователях.</li>
        </ul>
        
        <h2>6. Ограничение ответственности</h2>
        <p>
          Мы не несем ответственности за любые прямые, косвенные, случайные, особые или последующие убытки, возникшие в результате использования или невозможности использования нашего сервиса.
        </p>
        
        <h2>7. Прекращение действия</h2>
        <p>
          Мы можем прекратить или приостановить доступ к нашему сервису немедленно, без предварительного уведомления или ответственности, по любой причине, включая, без ограничений, нарушение условий использования.
        </p>
        
        <h2>8. Применимое право</h2>
        <p>
          Настоящие условия регулируются и толкуются в соответствии с законодательством Российской Федерации, без учета его коллизионных норм.
        </p>
        
        <h2>9. Контактная информация</h2>
        <p>
          Если у вас есть вопросы об условиях использования, пожалуйста, свяжитесь с нами по электронной почте: terms@mood-tracer.com
        </p>
      </div>
    </div>
  );
}
