import Link from 'next/link'
import { MessageCircle, Shield, Clock, Heart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">의료 AI 상담</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/chat" className="text-gray-500 hover:text-gray-900">
                상담 시작
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900">
                서비스 소개
              </Link>
              <Link href="/disclaimer" className="text-gray-500 hover:text-gray-900">
                면책조항
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            병원 방문 전<br />
            <span className="text-blue-600">AI 상담</span>으로<br />
            증상을 확인해보세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            의료 AI가 당신의 증상에 대해 초기 상담을 제공합니다. 
            응급 상황 감지 및 병원 방문 시점을 안내해드립니다.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            상담 시작하기
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold">24시간 상담</h3>
            </div>
            <p className="text-gray-600">
              언제든지 증상에 대해 질문하실 수 있습니다. 
              AI가 즉시 답변을 제공합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-lg font-semibold">응급 상황 감지</h3>
            </div>
            <p className="text-gray-600">
              응급 상황을 감지하면 즉시 병원 방문을 권고하고 
              적절한 조치를 안내합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-purple-500 mr-3" />
              <h3 className="text-lg font-semibold">빠른 응답</h3>
            </div>
            <p className="text-gray-600">
              몇 초 내에 답변을 받을 수 있습니다. 
              대기 시간 없이 즉시 상담을 받아보세요.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                중요한 안내사항
              </h3>
              <p className="text-yellow-700 text-sm">
                이 서비스는 의료 상담을 대체하지 않습니다. AI의 답변은 참고용이며, 
                정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다. 
                응급 상황 시에는 즉시 119에 연락하거나 가까운 응급실을 방문하세요.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 