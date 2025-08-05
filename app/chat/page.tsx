'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, AlertTriangle, Shield, User, Bot, Clock } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isEmergency?: boolean
  stage?: string
}

interface ConversationStage {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const conversationStages: ConversationStage[] = [
  {
    id: 'initial',
    name: '증상 파악',
    description: '주요 증상을 확인하고 있습니다',
    icon: <User className="h-4 w-4" />
  },
  {
    id: 'symptom_collection',
    name: '상세 확인',
    description: '증상의 세부사항을 파악하고 있습니다',
    icon: <Clock className="h-4 w-4" />
  },
  {
    id: 'detailed_analysis',
    name: '원인 분석',
    description: '가능한 원인을 분석하고 있습니다',
    icon: <Bot className="h-4 w-4" />
  },
  {
    id: 'summary',
    name: '상담 완료',
    description: '상담 결과를 정리하고 있습니다',
    icon: <Shield className="h-4 w-4" />
  }
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '안녕하세요! 어떤 증상으로 오셨나요? 자유롭게 말씀해주세요.',
      timestamp: new Date(),
      stage: 'initial'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState('initial')
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // AI 응답 후 자동 포커스
  useEffect(() => {
    if (!isLoading && messages.length > 0 && messages[messages.length - 1].type === 'ai') {
      // 약간의 지연을 두어 애니메이션이 완료된 후 포커스
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading, messages])

  const emergencyKeywords = [
    '심한 통증', '의식 상실', '호흡 곤란', '출혈',
    '가슴 통증', '마비', '발작', '중독', '응급', '119',
    '심장마비', '뇌졸중', '복통', '고열', '경련'
  ]

  const isEmergency = (message: string) => {
    return emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const getCurrentStageInfo = () => {
    return conversationStages.find(stage => stage.id === currentStage) || conversationStages[0]
  }

  const handleSendMessage = async () => {
    console.log('handleSendMessage 호출됨', { inputMessage, isLoading })
    
    if (!inputMessage.trim() || isLoading) {
      console.log('조건 불만족으로 함수 종료', { 
        hasInput: !!inputMessage.trim(), 
        isLoading 
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // 대화 히스토리를 더 정확하게 전송 (최근 30개 메시지로 증가)
      const recentMessages = messages.slice(-30)
      const conversationHistory = recentMessages.map(msg => ({
        type: msg.type,
        content: msg.content
      }))

      console.log('전송할 대화 히스토리:', conversationHistory)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: conversationHistory
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        isEmergency: isEmergency(data.response),
        stage: data.stage
      }

      setMessages(prev => [...prev, aiMessage])
      
      // 현재 단계 업데이트
      if (data.stage) {
        setCurrentStage(data.stage)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      console.log('로딩 상태 해제')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStageProgress = () => {
    const stageIndex = conversationStages.findIndex(stage => stage.id === currentStage)
    return ((stageIndex + 1) / conversationStages.length) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <Shield className="h-6 w-6 mr-2" />
              의료 AI 상담
            </Link>
            <div className="text-sm text-gray-500">
              AI 상담 서비스
            </div>
          </div>
        </div>
      </header>

      {/* Simple Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getCurrentStageInfo().icon}
              <span className="text-sm font-medium text-gray-700">
                {getCurrentStageInfo().name}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {getCurrentStageInfo().description}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`chat-bubble ${
                  message.type === 'user' 
                    ? 'user-bubble' 
                    : message.isEmergency 
                      ? 'emergency-alert' 
                      : 'ai-bubble'
                }`}
              >
                {message.isEmergency && (
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-red-600 font-semibold text-sm">응급 상황</span>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-2">
                  {isClient && message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="ai-bubble chat-bubble">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm text-gray-600">답변을 생성하고 있습니다...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="증상에 대해 자유롭게 말씀해주세요..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent chat-input"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => {
                console.log('전송 버튼 클릭됨')
                handleSendMessage()
              }}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {/* Disclaimer */}
          <div className="medical-disclaimer mt-4">
            <div className="flex items-start">
              <Shield className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
              <p className="text-xs">
                이 서비스는 의료 상담을 대체하지 않습니다. 정확한 진단과 치료를 위해서는 
                반드시 의료진과 상담하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 