import Link from 'next/link'
import { Heart, Shield, Clock, MessageCircle, AlertTriangle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">의료 AI 상담</h1>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/chat" className="text-gray-500 hover:text-gray-900">
                상담 시작
              </Link>
              <Link href="/about" className="text-blue-600 font-medium">
                서비스 소개
              </Link>
              <Link href="/disclaimer" className="text-gray-500 hover:text-gray-900">
                면책조항
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            의료 AI 상담 서비스 소개
          </h1>
          <p className="text-xl text-gray-600">
            병원 방문 전 증상에 대한 초기 상담을 제공하는 AI 서비스입니다
          </p>
        </div>

        {/* Service Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">서비스 개요</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스 목적</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  병원 방문 전 환자의 증상에 대한 초기 상담 제공
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  의료 정보에 대한 신뢰할 수 있는 답변 제공
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  병원 방문 결정을 위한 가이드 역할
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 특징</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  24시간 언제든지 상담 가능
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  응급 상황 자동 감지 및 대응
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  의료진 상담 권장 시스템
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">이용 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. 증상 질문</h3>
              <p className="text-gray-600">
                증상에 대해 자유롭게 질문해주세요. AI가 즉시 답변을 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. 안전한 답변</h3>
              <p className="text-gray-600">
                의료 특화 AI가 안전하고 신뢰할 수 있는 답변을 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. 병원 방문 가이드</h3>
              <p className="text-gray-600">
                언제 병원을 방문해야 하는지, 어떤 준비가 필요한지 안내합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">안전 기능</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">응급 상황 감지</h3>
                <p className="text-gray-600">
                  응급 상황을 감지하면 즉시 119 연락이나 응급실 방문을 권고합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-yellow-500 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">의료 면책조항</h3>
                <p className="text-gray-600">
                  AI 답변의 한계를 명시하고, 의료진 상담의 중요성을 강조합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Heart className="h-6 w-6 text-green-500 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">사용자 보호</h3>
                <p className="text-gray-600">
                  개인정보 수집을 최소화하고, 안전한 데이터 처리를 보장합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            상담 시작하기
          </Link>
        </div>
      </main>
    </div>
  )
} 