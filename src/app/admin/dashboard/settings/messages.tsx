import React from 'react';

// 定义留言数据类型
interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  content: string;
  createdAt: string;
  status: 'PENDING' | 'ANSWERED' | 'ARCHIVED';
  notes?: string;
}

// 留言管理组件
export default function MessagesManager() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [notes, setNotes] = React.useState('');
  
  // 加载留言数据
  React.useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        
        // 从API获取联系消息
        const response = await fetch('/api/contact/message');
        
        if (!response.ok) {
          throw new Error(`获取消息失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 格式化日期
        const formattedMessages = data.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt).toLocaleString('zh-CN')
        }));
        
        setMessages(formattedMessages);
        setError('');
      } catch (err) {
        console.error('加载留言失败:', err);
        setError('加载留言失败，请刷新页面重试');
        
        // 如果API失败，尝试从localStorage加载（开发环境备用方案）
        if (typeof window !== 'undefined') {
          const savedMessages = localStorage.getItem('userMessages');
          if (savedMessages) {
            try {
              const localMessages = JSON.parse(savedMessages);
              setMessages(localMessages);
              setError('');
            } catch (e) {
              console.error('解析本地数据失败:', e);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, []);
  
  // 更新留言状态
  const handleStatusChange = async (id: string, status: 'PENDING' | 'ANSWERED' | 'ARCHIVED') => {
    try {
      // 更新API中的状态
      const response = await fetch(`/api/contact/message/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });
      
      if (!response.ok) {
        throw new Error(`更新消息状态失败: ${response.status}`);
      }
      
      // 更新本地状态
      setMessages((prevMessages: Message[]) => 
        prevMessages.map((msg: Message) => 
          msg.id === id ? { ...msg, status, notes: notes || msg.notes } : msg
        )
      );
      
      setSelectedMessage(null);
      setNotes('');
      
    } catch (err) {
      console.error('更新留言状态失败:', err);
      alert('更新留言状态失败，请重试');
      
      // 开发环境备用方案
      if (process.env.NODE_ENV === 'development') {
        setMessages((prevMessages: Message[]) => 
          prevMessages.map((msg: Message) => 
            msg.id === id ? { ...msg, status, notes: notes || msg.notes } : msg
          )
        );
        
        if (typeof window !== 'undefined') {
          const savedMessages = localStorage.getItem('userMessages');
          if (savedMessages) {
            try {
              const localMessages = JSON.parse(savedMessages);
              const updatedMessages = localMessages.map((msg: any) => 
                msg.id.toString() === id ? { ...msg, status, notes: notes || msg.notes } : msg
              );
              localStorage.setItem('userMessages', JSON.stringify(updatedMessages));
            } catch (e) {
              console.error('更新本地数据失败:', e);
            }
          }
        }
        
        setSelectedMessage(null);
        setNotes('');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">留言管理</h2>
      
      {messages.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded text-center">
          <p>暂无留言</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  姓名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系方式
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  服务类型
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message: Message) => (
                <tr key={message.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{message.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{message.phone}</div>
                    <div className="text-sm text-gray-500">{message.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{message.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{message.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${message.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        message.status === 'ANSWERED' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {message.status === 'PENDING' ? '待处理' : 
                        message.status === 'ANSWERED' ? '已回复' : '已归档'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedMessage(message)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 留言详情模态框 */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">留言详情</h3>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">姓名</p>
                <p className="font-medium">{selectedMessage.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">联系方式</p>
                <p>{selectedMessage.phone}</p>
                <p>{selectedMessage.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">咨询服务</p>
                <p>{selectedMessage.service}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">留言内容</p>
                <p className="bg-gray-50 p-3 rounded">{selectedMessage.content}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">处理备注</p>
                <textarea
                  value={notes || selectedMessage.notes || ''}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded p-2 h-24"
                  placeholder="添加处理备注..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'ANSWERED')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  标记为已回复
                </button>
                
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'ARCHIVED')}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  归档
                </button>
                
                {selectedMessage.status !== 'PENDING' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'PENDING')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    重新标记为待处理
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 