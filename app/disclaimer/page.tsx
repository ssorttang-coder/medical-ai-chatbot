import Link from 'next/link'
import { Heart, Shield, AlertTriangle, Info } from 'lucide-react'

export default function DisclaimerPage() {
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
              <Link href="/about" className="text-gray-500 hover:text-gray-900">
                서비스 소개
              </Link>
              <Link href="/disclaimer" className="text-blue-600 font-medium">
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
            면책조항 및 이용약관
          </h1>
          <p className="text-xl text-gray-600">
            의료 AI 상담 서비스 이용 시 반드시 숙지하셔야 할 중요한 안내사항입니다
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-4 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-red-800 mb-2">
                ⚠️ 중요한 안내사항
              </h2>
              <p className="text-red-700">
                이 서비스는 의료 상담을 대체하지 않습니다. AI의 답변은 참고용이며, 
                정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다. 
                응급 상황 시에는 즉시 119에 연락하거나 가까운 응급실을 방문하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Service Limitations */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">서비스의 한계</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-blue-500 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">진단의 한계</h3>
                <p className="text-gray-600">
                  AI는 의료진의 진단을 대체할 수 없습니다. 증상에 대한 일반적인 정보만 제공하며, 
                  개별 환자의 특수한 상황을 고려하지 않을 수 있습니다.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Info className="h-6 w-6 text-blue-500 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">처방의 한계</h3>
                <p className="text-gray-600">
                  구체적인 약물 처방이나 치료 방법을 제시하지 않습니다. 
                  모든 치료 관련 결정은 반드시 의료진과 상담 후 이루어져야 합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Info className="h-6 w-6 text-blue-500 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">응급 상황의 한계</h3>
                <p className="text-gray-600">
                  응급 상황을 감지할 수 있지만, 모든 응급 상황을 정확히 판단하지 못할 수 있습니다. 
                  응급 상황이 의심되면 즉시 전문 의료진의 도움을 받으세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">이용자의 책임</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600">
                AI 답변을 참고하여 의료진과 상담할 때 정확한 정보를 전달할 책임이 있습니다.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600">
                응급 상황 시 즉시 119에 연락하거나 응급실을 방문할 책임이 있습니다.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600">
                AI 답변에만 의존하여 치료를 지연시키지 않을 책임이 있습니다.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600">
                개인정보 보호를 위해 민감한 개인정보를 입력하지 않을 책임이 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">개인정보 보호</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              본 서비스는 개인정보 수집을 최소화하며, 대화 내용은 서비스 개선 목적으로만 사용됩니다.
            </p>
            <p className="text-gray-600">
              개인을 식별할 수 있는 정보는 수집하지 않으며, 모든 데이터는 암호화되어 처리됩니다.
            </p>
            <p className="text-gray-600">
              대화 내용은 일정 기간 후 자동으로 삭제되며, 영구 보관되지 않습니다.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">법적 면책조항</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              본 서비스는 정보 제공 목적으로만 운영되며, 의료 서비스를 제공하지 않습니다.
            </p>
            <p>
              AI 답변으로 인한 직접적 또는 간접적 손해에 대해 서비스 제공자는 책임을 지지 않습니다.
            </p>
            <p>
              모든 의료 관련 결정은 반드시 전문 의료진과 상담 후 이루어져야 합니다.
            </p>
            <p>
              본 서비스 이용으로 인한 건강상의 문제가 발생하더라도 서비스 제공자는 책임을 지지 않습니다.
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-yellow-800 mb-2">
                응급 상황 시 연락처
              </h2>
              <div className="space-y-2 text-yellow-700">
                <p><strong>119</strong> - 응급 상황 전화</p>
                <p><strong>1339</strong> - 보건복지부 콜센터</p>
                <p><strong>가까운 응급실</strong> - 즉시 방문</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">이용 동의</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              본 서비스를 이용함으로써 위의 모든 면책조항과 이용약관에 동의하는 것으로 간주됩니다.
            </p>
            <p className="text-gray-600">
              면책조항에 동의하지 않는 경우 서비스 이용을 중단하시기 바랍니다.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shield className="mr-2 h-5 w-5" />
            면책조항에 동의하고 상담 시작
          </Link>
        </div>
      </main>
    </div>
  )
} 