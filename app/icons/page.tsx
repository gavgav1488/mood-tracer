'use client';

import {
  CaretDownOutlined,
  HeartFilled,
  SmileOutlined,
  StarFilled,
  BarChartOutlined,
  SettingOutlined,
  BookOutlined,
  UserOutlined,
  BellOutlined,
  CalendarOutlined,
  PlusOutlined,
  FireOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  GiftOutlined,
  EyeOutlined,
  ShareAltOutlined
} from '../../src/components/icons/ant-icons';

const iconData = [
  { icon: CaretDownOutlined, name: 'CaretDownOutlined', description: 'Выпадающие меню', color: 'text-blue-500' },
  { icon: HeartFilled, name: 'HeartFilled', description: 'Эмоции и любовь', color: 'text-red-500' },
  { icon: SmileOutlined, name: 'SmileOutlined', description: 'Настроение', color: 'text-yellow-500' },
  { icon: StarFilled, name: 'StarFilled', description: 'Достижения', color: 'text-orange-500' },
  { icon: BarChartOutlined, name: 'BarChartOutlined', description: 'Аналитика', color: 'text-purple-500' },
  { icon: SettingOutlined, name: 'SettingOutlined', description: 'Настройки', color: 'text-gray-500' },
  { icon: BookOutlined, name: 'BookOutlined', description: 'Дневник', color: 'text-green-500' },
  { icon: UserOutlined, name: 'UserOutlined', description: 'Профиль', color: 'text-indigo-500' },
  { icon: BellOutlined, name: 'BellOutlined', description: 'Уведомления', color: 'text-pink-500' },
  { icon: CalendarOutlined, name: 'CalendarOutlined', description: 'Календарь', color: 'text-teal-500' },
  { icon: PlusOutlined, name: 'PlusOutlined', description: 'Добавить', color: 'text-emerald-500' },
  { icon: FireOutlined, name: 'FireOutlined', description: 'Энергия', color: 'text-red-600' },
  { icon: ThunderboltOutlined, name: 'ThunderboltOutlined', description: 'Мощность', color: 'text-yellow-600' },
  { icon: RocketOutlined, name: 'RocketOutlined', description: 'Запуск', color: 'text-blue-600' },
  { icon: GiftOutlined, name: 'GiftOutlined', description: 'Подарки', color: 'text-pink-600' },
  { icon: EyeOutlined, name: 'EyeOutlined', description: 'Просмотр', color: 'text-cyan-500' },
  { icon: ShareAltOutlined, name: 'ShareAltOutlined', description: 'Поделиться', color: 'text-violet-500' },
];

export default function IconsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-primary mb-6">
            <StarFilled className="h-4 w-4 animate-pulse-soft" />
            <span className="font-handwritten text-base">Коллекция иконок ✨</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            <span className="text-gradient-cosmic">Ant Design</span>
            <br />
            <span className="font-handwritten text-gradient-primary">иконки</span>
          </h1>

          <p className="max-w-[600px] mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Полная коллекция иконок Ant Design, интегрированных в mood-tracer 🎨
          </p>
        </div>

        {/* Icons Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {iconData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="group glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon Display */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 ${item.color}`} />
                    </div>

                    {/* Icon Name */}
                    <h3 className="text-lg font-semibold text-gradient-primary">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {/* Usage Example */}
                    <div className="w-full p-3 bg-muted/20 rounded-xl">
                      <code className="text-xs text-muted-foreground font-mono">
                        &lt;{item.name} /&gt;
                      </code>
                    </div>

                    {/* Interactive Demo */}
                    <button className="w-full glass-button rounded-xl px-4 py-2 text-sm hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>Демо</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gradient-primary mb-6 text-center">
              Как использовать иконки 📚
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOutlined className="h-5 w-5 text-primary" />
                  Импорт
                </h3>
                <div className="p-4 bg-muted/20 rounded-xl">
                  <code className="text-sm font-mono text-muted-foreground">
                    {`import { HeartFilled } from '@/src/components/icons/ant-icons';`}
                  </code>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <RocketOutlined className="h-5 w-5 text-primary" />
                  Использование
                </h3>
                <div className="p-4 bg-muted/20 rounded-xl">
                  <code className="text-sm font-mono text-muted-foreground">
                    {`<HeartFilled className="h-5 w-5 text-red-500" />`}
                  </code>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                💡 Все иконки поддерживают стандартные props: className, style, onClick
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
