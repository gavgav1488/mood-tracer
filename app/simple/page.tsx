import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  HeartFilled,
  StarFilled,
  FireOutlined,
  RocketOutlined,
  EyeOutlined,
  AvatarOutlined
} from '@/components/icons/ant-icons';

export default function SimplePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/30 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="container px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            
            {/* Hero Content */}
            <div className="space-y-8 animate-slide-in">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 rounded-full glass-card px-6 py-3 text-sm font-medium text-primary animate-pulse-soft">
                <FireOutlined className="h-5 w-5" />
                <span className="font-handwritten text-lg">✨ Новое поколение дневников эмоций</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                <span className="block text-gradient-cosmic">Mood</span>
                <span className="block text-gradient-primary font-handwritten">Tracer</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Твой персональный спутник в мире эмоций. Отслеживай, анализируй и развивайся каждый день 🚀
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Button asChild size="lg" className="glass-button rounded-full px-12 py-6 text-lg bg-gradient-primary border-0 hover:scale-110 transition-all duration-300 shadow-2xl">
                  <Link href="/diary" className="inline-flex items-center gap-3">
                    <HeartFilled className="h-6 w-6" />
                    Начать сейчас
                    <RocketOutlined className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="glass-button rounded-full px-12 py-6 text-lg hover:scale-110 transition-all duration-300">
                  <Link href="/demo" className="inline-flex items-center gap-3">
                    <EyeOutlined className="h-6 w-6" />
                    Посмотреть демо
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16 animate-scale-in" style={{animationDelay: '0.5s'}}>
              
              {/* Stat 1 */}
              <div className="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <AvatarOutlined className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                      ↗️ +15%
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gradient-primary mb-1">2.5K+</div>
                  <div className="text-sm text-muted-foreground mb-2">Активных пользователей</div>
                  <div className="text-xs text-blue-500">👥 Растущее сообщество</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <HeartFilled className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">
                      📈 Ежедневно
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gradient-primary mb-1">150K+</div>
                  <div className="text-sm text-muted-foreground mb-2">Эмоциональных записей</div>
                  <div className="text-xs text-purple-500">💜 Делимся чувствами</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <RocketOutlined className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                      ⚡ 24/7
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gradient-primary mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground mb-2">Время работы</div>
                  <div className="text-xs text-green-500">🚀 Всегда доступен</div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <StarFilled className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
                      ⭐ 4.9/5
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gradient-primary mb-1">98%</div>
                  <div className="text-sm text-muted-foreground mb-2">Довольных пользователей</div>
                  <div className="text-xs text-yellow-500">🌟 Высокий рейтинг</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-12 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-gradient-cosmic">Готов начать?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Присоединяйся к тысячам людей, которые уже улучшили своё эмоциональное благополучие
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                <Button asChild size="lg" className="glass-button rounded-full px-12 py-6 text-lg bg-gradient-primary border-0 hover:scale-110 transition-all duration-300 shadow-2xl">
                  <Link href="/register" className="inline-flex items-center gap-3">
                    <RocketOutlined className="h-6 w-6" />
                    Создать аккаунт
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="glass-button rounded-full px-12 py-6 text-lg hover:scale-110 transition-all duration-300">
                  <Link href="/login" className="inline-flex items-center gap-3">
                    <HeartFilled className="h-6 w-6" />
                    Войти
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
