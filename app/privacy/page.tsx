export default function PrivacyPage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Политика конфиденциальности</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead">
          Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
        </p>
        
        <h2>1. Введение</h2>
        <p>
          Добро пожаловать в Дневник настроения. Мы уважаем вашу конфиденциальность и стремимся защитить ваши персональные данные.
          Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем информацию, которую вы предоставляете при использовании нашего сервиса.
        </p>
        
        <h2>2. Какую информацию мы собираем</h2>
        <p>
          Мы собираем следующие типы информации:
        </p>
        <ul>
          <li>Информация аккаунта: электронная почта, имя пользователя и другие данные, предоставляемые при регистрации через социальные сети.</li>
          <li>Контент дневника: эмодзи, текстовые записи и другой контент, который вы создаете при использовании сервиса.</li>
          <li>Технические данные: IP-адрес, тип браузера, время доступа и другая информация о вашем устройстве.</li>
        </ul>
        
        <h2>3. Как мы используем вашу информацию</h2>
        <p>
          Мы используем собранную информацию для:
        </p>
        <ul>
          <li>Предоставления и поддержки нашего сервиса.</li>
          <li>Улучшения и персонализации пользовательского опыта.</li>
          <li>Обеспечения безопасности вашего аккаунта.</li>
          <li>Связи с вами по вопросам, связанным с сервисом.</li>
        </ul>
        
        <h2>4. Защита данных</h2>
        <p>
          Мы принимаем соответствующие меры безопасности для защиты от несанкционированного доступа, изменения, раскрытия или уничтожения вашей личной информации.
          Все данные хранятся в зашифрованном виде и доступны только вам.
        </p>
        
        <h2>5. Доступ к вашим данным</h2>
        <p>
          Ваши записи в дневнике видны только вам. Мы не предоставляем доступ к вашим личным записям третьим лицам, за исключением случаев, предусмотренных законодательством.
        </p>
        
        <h2>6. Изменения в политике конфиденциальности</h2>
        <p>
          Мы можем обновлять нашу политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, разместив новую политику конфиденциальности на этой странице.
        </p>
        
        <h2>7. Контактная информация</h2>
        <p>
          Если у вас есть вопросы о нашей политике конфиденциальности, пожалуйста, свяжитесь с нами по электронной почте: privacy@mood-tracer.com
        </p>
      </div>
    </div>
  );
}
