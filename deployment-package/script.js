// Amrikyy AI JavaScript Functionality

// State management
let currentChat = null;
let chatHistory = JSON.parse(localStorage.getItem('amrikyyAI_chatHistory')) || [];
let isTyping = false;

// Amrikyy's knowledge base (simplified for demo)
const knowledgeBase = {
    'solid': {
        title: 'SOLID Principles',
        content: `مبادئ SOLID في البرمجة:

**S - Single Responsibility Principle (مبدأ المسؤولية الواحدة)**
كل كلاس يجب أن يكون له سبب واحد للتغيير.

**O - Open/Closed Principle (مبدأ المفتوح/المغلق)**
الكلاسات يجب أن تكون مفتوحة للتوسيع، مغلقة للتعديل.

**L - Liskov Substitution Principle (مبدأ استبدال ليسكوف)**
الكائنات المشتقة يجب أن تكون قابلة للاستبدال مع كائناتها الأساسية.

**I - Interface Segregation Principle (مبدأ فصل الواجهات)**
لا تجبر العملاء على الاعتماد على واجهات لا يستخدمونها.

**D - Dependency Inversion Principle (مبدأ انعكاس التبعية)**
اعتمد على التجريدات، ليس على التفاصيل الملموسة.

\`\`\`python
# مثال على تطبيق SOLID في Python
from abc import ABC, abstractmethod

# Interface Segregation
class Readable(ABC):
    @abstractmethod
    def read(self):
        pass

class Writable(ABC):
    @abstractmethod
    def write(self, data):
        pass

# Single Responsibility
class FileReader(Readable):
    def __init__(self, filename):
        self.filename = filename
    
    def read(self):
        with open(self.filename, 'r') as file:
            return file.read()

class FileWriter(Writable):
    def __init__(self, filename):
        self.filename = filename
    
    def write(self, data):
        with open(self.filename, 'w') as file:
            file.write(data)
\`\`\``
    },
    'circuit-breaker': {
        title: 'Circuit Breaker Pattern',
        content: `نمط Circuit Breaker لإدارة الأخطاء في الأنظمة الموزعة:

**المفهوم:**
يمنع النمط استمرار المحاولات الفاشلة لخدمة غير متاحة، مما يحسن الاستقرار والأداء.

**الحالات الثلاث:**
- **Closed**: الطلبات تمر بشكل طبيعي
- **Open**: الطلبات تفشل فوراً
- **Half-Open**: اختبار الخدمة للتعافي

\`\`\`python
import time
from enum import Enum
from typing import Callable, Any

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"  
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _should_attempt_reset(self) -> bool:
        return (
            self.last_failure_time and
            time.time() - self.last_failure_time >= self.recovery_timeout
        )
    
    def _on_success(self):
        self.failure_count = 0
        if self.state == CircuitState.HALF_OPEN:
            self.state = CircuitState.CLOSED
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

# Example usage
def unreliable_service():
    import random
    if random.random() < 0.7:  # 70% failure rate
        raise ConnectionError("Service unavailable")
    return "Success!"

circuit_breaker = CircuitBreaker(failure_threshold=3)

try:
    result = circuit_breaker.call(unreliable_service)
    print(f"Result: {result}")
except Exception as e:
    print(f"Error: {e}")
\`\`\``
    },
    'database': {
        title: 'Database Best Practices',
        content: `أفضل الممارسات في تصميم قواعد البيانات:

**1. تصميم الجداول:**
- استخدم primary keys مناسبة
- تجنب null values عند الإمكان
- اختر أنواع البيانات المناسبة

**2. الفهرسة (Indexing):**
- أنشئ فهارس على الأعمدة المستخدمة في WHERE
- تجنب الفهرسة المفرطة
- استخدم فهارس مركبة للاستعلامات المعقدة

**3. الطبيعة النسبية (Normalization):**
- طبق 1NF, 2NF, 3NF حسب الحاجة
- تجنب الازدواجية
- وازن بين الطبيعة والأداء

**4. الأمان:**
- استخدم parameterized queries
- طبق مبدأ least privilege
- فعّل تشفير البيانات الحساسة

\`\`\`sql
-- مثال على تصميم جدول محسن
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_active_users (is_active, created_at)
);

-- استعلام محسن مع استخدام الفهارس
SELECT id, full_name, email 
FROM users 
WHERE is_active = TRUE 
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY created_at DESC
LIMIT 100;
\`\`\``
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadChatHistory();
    setupEventListeners();
    updateStatus('جاهز للمساعدة');
});

function setupEventListeners() {
    // File input change
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // Modal close on background click
    document.getElementById('uploadModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

function startNewChat() {
    currentChat = {
        id: Date.now().toString(),
        title: 'محادثة جديدة',
        messages: [],
        createdAt: new Date()
    };
    
    // Show welcome screen
    document.getElementById('welcomeScreen').style.display = 'flex';
    document.getElementById('messagesContainer').style.display = 'none';
    
    updateChatList();
    updateStatus('محادثة جديدة - جاهز للمساعدة');
}

function askQuestion(question) {
    document.getElementById('messageInput').value = question;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Create chat if doesn't exist
    if (!currentChat) {
        startNewChat();
    }
    
    // Hide welcome screen and show messages
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('messagesContainer').style.display = 'block';
    
    // Add user message
    addMessage('user', message);
    input.value = '';
    autoResize(input);
    
    // Update chat title if it's the first message
    if (currentChat.messages.length === 1) {
        currentChat.title = message.length > 50 ? message.substring(0, 50) + '...' : message;
        updateChatList();
    }
    
    // Show typing indicator and generate response
    showTypingIndicator();
    setTimeout(() => {
        generateResponse(message);
    }, 1000 + Math.random() * 2000); // Simulate processing time
}

function addMessage(role, content, sources = null) {
    const message = {
        id: Date.now().toString(),
        role: role,
        content: content,
        timestamp: new Date(),
        sources: sources
    };
    
    currentChat.messages.push(message);
    renderMessage(message);
    saveChatHistory();
    
    // Scroll to bottom
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function renderMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role}`;
    
    const avatar = message.role === 'user' ? 
        'U' : 
        'AI';
    
    const sourcesHtml = message.sources ? 
        `<div class="sources-badge">
            <i class="fas fa-check-circle"></i>
            <span>مدعوم بمصادر موثقة</span>
        </div>` : '';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble">
                ${formatMessage(message.content)}
                ${sourcesHtml}
            </div>
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
}

function formatMessage(content) {
    // Convert markdown-like formatting to HTML
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/g, '<div class="code-block">$1</div>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

function formatTime(date) {
    return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function showTypingIndicator() {
    isTyping = true;
    updateStatus('جاري الكتابة...');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-brain"></i></div>
        <div class="message-content">
            <div class="message-bubble">
                <div style="display: flex; gap: 4px; align-items: center;">
                    <span>جاري التفكير</span>
                    <div style="display: flex; gap: 2px;">
                        <div class="typing-dot" style="width: 4px; height: 4px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
                        <div class="typing-dot" style="width: 4px; height: 4px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; animation-delay: 0.2s;"></div>
                        <div class="typing-dot" style="width: 4px; height: 4px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; animation-delay: 0.4s;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('messages').appendChild(typingDiv);
    
    // Add typing animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-10px); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
    isTyping = false;
    updateStatus('جاهز للمساعدة');
}

function generateResponse(userMessage) {
    hideTypingIndicator();
    
    // Simple keyword matching for demo
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let sources = null;
    
    if (lowerMessage.includes('solid') || lowerMessage.includes('مبادئ')) {
        response = knowledgeBase.solid.content;
        sources = ['SOLID Principles Documentation'];
    } else if (lowerMessage.includes('circuit') || lowerMessage.includes('breaker') || lowerMessage.includes('نمط')) {
        response = knowledgeBase['circuit-breaker'].content;
        sources = ['Design Patterns Handbook'];
    } else if (lowerMessage.includes('database') || lowerMessage.includes('قاعدة') || lowerMessage.includes('بيانات')) {
        response = knowledgeBase.database.content;
        sources = ['Database Design Best Practices'];
    } else if (lowerMessage.includes('مرحب') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = `مرحباً! أنا محمد عبدالعزيز (Amrikyy)، مساعدك في البرمجة والتطوير.

أملك خبرة واسعة في:
- **Python** و تطبيقات الذكاء الاصطناعي
- **JavaScript** و تطوير الواجهات
- **تصميم الأنظمة** و الهندسة المعمارية
- **الأمن السيبراني** و أفضل الممارسات

كيف يمكنني مساعدتك اليوم؟ 🚀`;
    } else if (lowerMessage.includes('من أنت') || lowerMessage.includes('who are you')) {
        response = `أنا **محمد عبدالعزيز** (Amrikyy) - مطور ومهندس تقني متخصص في:

**🎓 التعليم:**
- طالب هندسة الأمن السيبراني في جامعة Kennesaw State
- حاصل على شهادات من OpenAI وIntel وL'Oréal

**💼 الخبرة المهنية:**
- Innovation & Strategy Intern في Global Career Accelerator
- مطور مستقل متخصص في الذكاء الاصطناعي وWeb3
- متداول عملات مشفرة منذ 2020

**🛠️ المهارات التقنية:**
- Python (خبير)
- JavaScript/TypeScript (متقدم)
- تصميم UX/UI
- هندسة البرومبت
- تحليل البيانات

أساعدك في حل المشاكل البرمجية وتطوير المشاريع التقنية! 💻`;
    } else {
        // General programming help
        response = `شكراً لسؤالك! كمهندس تقني متخصص، يمكنني مساعدتك في:

**🔧 البرمجة والتطوير:**
- Python, JavaScript, وتقنيات أخرى
- تصميم الخوارزميات وحل المشاكل
- أفضل الممارسات في الكود النظيف

**🏗️ الهندسة المعمارية:**
- تصميم الأنظمة الموزعة
- أنماط التصميم (Design Patterns)
- قواعد البيانات والأداء

**🤖 الذكاء الاصطناعي:**
- تطوير تطبيقات الـ AI
- معالجة اللغات الطبيعية
- تحليل البيانات

هل يمكنك تحديد المجال الذي تحتاج المساعدة فيه؟ سأكون سعيداً لمساعدتك! 🚀`;
    }
    
    addMessage('assistant', response, sources);
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function updateStatus(status) {
    document.getElementById('statusText').textContent = status;
}

function showUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
}

function closeModal() {
    document.getElementById('uploadModal').classList.remove('active');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Show loading
    showLoading();
    
    // Simulate file processing
    setTimeout(() => {
        hideLoading();
        closeModal();
        
        const message = `تم رفع الملف "${file.name}" بنجاح! يمكنك الآن طرح أسئلة حول محتوى الملف.`;
        
        if (!currentChat) {
            startNewChat();
        }
        
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('messagesContainer').style.display = 'block';
        
        addMessage('assistant', message, ['Uploaded Document: ' + file.name]);
        
        // Reset file input
        event.target.value = '';
    }, 2000);
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function loadChatHistory() {
    const chatListDiv = document.getElementById('chatList');
    chatListDiv.innerHTML = '';
    
    chatHistory.forEach(chat => {
        const chatDiv = document.createElement('div');
        chatDiv.className = 'chat-item';
        chatDiv.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${chat.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">
                ${new Date(chat.createdAt).toLocaleDateString('ar-SA')}
            </div>
        `;
        chatDiv.onclick = () => loadChat(chat);
        chatListDiv.appendChild(chatDiv);
    });
    
    if (chatHistory.length === 0) {
        chatListDiv.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">لا توجد محادثات سابقة</div>';
    }
}

function updateChatList() {
    if (currentChat) {
        // Update or add current chat to history
        const existingIndex = chatHistory.findIndex(chat => chat.id === currentChat.id);
        if (existingIndex >= 0) {
            chatHistory[existingIndex] = { ...currentChat };
        } else {
            chatHistory.unshift({ ...currentChat });
        }
        
        // Keep only last 20 chats
        chatHistory = chatHistory.slice(0, 20);
        
        saveChatHistory();
        loadChatHistory();
    }
}

function loadChat(chat) {
    currentChat = { ...chat };
    
    // Clear messages and render chat
    document.getElementById('messages').innerHTML = '';
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('messagesContainer').style.display = 'block';
    
    currentChat.messages.forEach(message => {
        renderMessage(message);
    });
    
    updateStatus(`محادثة: ${chat.title}`);
}

function saveChatHistory() {
    try {
        localStorage.setItem('amrikyyAI_chatHistory', JSON.stringify(chatHistory));
    } catch (e) {
        console.warn('Failed to save chat history:', e);
    }
}

// Initialize with a welcome message
window.onload = function() {
    updateStatus('مرحباً! أنا محمد عبدالعزيز (Amrikyy) - جاهز لمساعدتك في البرمجة والتطوير 🚀');
};
