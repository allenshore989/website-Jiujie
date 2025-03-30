"use client";

import * as React from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

// 关于页数据类型定义
interface AboutPageData {
  mission: {
    title: string;
    content: string[];
    features: {
      title: string;
      description: string;
    }[];
  };
  history: {
    title: string;
    events: {
      year: string;
      description: string;
    }[];
  };
  team: {
    title: string;
    members: {
      name: string;
      title: string;
      image: string;
      description: string;
    }[];
  };
}

export default function AboutPageEditor() {
  const [aboutData, setAboutData] = React.useState<AboutPageData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // 加载关于页数据
  React.useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/about');
        
        if (!response.ok) {
          throw new Error(`获取关于页数据失败: ${response.status}`);
        }
        
        const data = await response.json();
        setAboutData(data);
        setError(null);
      } catch (error) {
        console.error('加载关于页数据出错:', error);
        setError('无法加载关于页数据，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);

  // 保存关于页数据
  const handleSave = async () => {
    if (!aboutData) return;
    
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存失败');
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // 3秒后隐藏成功消息
    } catch (error) {
      console.error('保存关于页数据出错:', error);
      setSaveError(error instanceof Error ? error.message : '保存数据时出错');
    } finally {
      setSaving(false);
    }
  };

  // 更新使命内容
  const handleContentChange = (paragraph: string, index: number) => {
    if (!aboutData) return;
    
    const newContent = [...aboutData.mission.content];
    newContent[index] = paragraph;
    
    setAboutData({
      ...aboutData,
      mission: {
        ...aboutData.mission,
        content: newContent
      }
    });
  };

  // 添加新段落
  const addParagraph = () => {
    if (!aboutData) return;
    
    setAboutData({
      ...aboutData,
      mission: {
        ...aboutData.mission,
        content: [...aboutData.mission.content, '请输入新段落内容']
      }
    });
  };

  // 删除段落
  const removeParagraph = (index: number) => {
    if (!aboutData) return;
    
    const newContent = aboutData.mission.content.filter((_: string, i: number) => i !== index);
    
    setAboutData({
      ...aboutData,
      mission: {
        ...aboutData.mission,
        content: newContent
      }
    });
  };

  // 更新特色
  const handleFeatureChange = (feature: { title: string; description: string }, index: number) => {
    if (!aboutData) return;
    
    const newFeatures = [...aboutData.mission.features];
    newFeatures[index] = feature;
    
    setAboutData({
      ...aboutData,
      mission: {
        ...aboutData.mission,
        features: newFeatures
      }
    });
  };

  // 添加特色
  const addFeature = () => {
    if (!aboutData) return;
    
    setAboutData({
      ...aboutData,
      mission: {
        ...aboutData.mission,
        features: [
          ...aboutData.mission.features,
          { title: '新特色', description: '特色描述' }
        ]
      }
    });
  };

  // 删除特色
  const removeFeature = (index: number) => {
    if (!aboutData) return;
    
    const newFeatures = aboutData.mission.features.filter((_: { title: string; description: string }, i: number) => i !== index);
    
    setAboutData({
      ...aboutData,
      mission: {
        ...aboutData.mission,
        features: newFeatures
      }
    });
  };

  // 更新历史事件
  const handleHistoryChange = (event: { year: string; description: string }, index: number) => {
    if (!aboutData) return;
    
    const newEvents = [...aboutData.history.events];
    newEvents[index] = event;
    
    setAboutData({
      ...aboutData,
      history: {
        ...aboutData.history,
        events: newEvents
      }
    });
  };

  // 添加历史事件
  const addHistoryEvent = () => {
    if (!aboutData) return;
    
    setAboutData({
      ...aboutData,
      history: {
        ...aboutData.history,
        events: [
          ...aboutData.history.events,
          { year: '新年份', description: '事件描述' }
        ]
      }
    });
  };

  // 删除历史事件
  const removeHistoryEvent = (index: number) => {
    if (!aboutData) return;
    
    const newEvents = aboutData.history.events.filter((_: { year: string; description: string }, i: number) => i !== index);
    
    setAboutData({
      ...aboutData,
      history: {
        ...aboutData.history,
        events: newEvents
      }
    });
  };

  // 更新团队成员
  const handleTeamMemberChange = (member: { name: string; title: string; image: string; description: string }, index: number) => {
    if (!aboutData) return;
    
    const newMembers = [...aboutData.team.members];
    newMembers[index] = member;
    
    setAboutData({
      ...aboutData,
      team: {
        ...aboutData.team,
        members: newMembers
      }
    });
  };

  // 添加团队成员
  const addTeamMember = () => {
    if (!aboutData) return;
    
    setAboutData({
      ...aboutData,
      team: {
        ...aboutData.team,
        members: [
          ...aboutData.team.members,
          {
            name: '新成员',
            title: '职位',
            image: '/images/placeholder.svg',
            description: '成员介绍'
          }
        ]
      }
    });
  };

  // 删除团队成员
  const removeTeamMember = (index: number) => {
    if (!aboutData) return;
    
    const newMembers = aboutData.team.members.filter((_: { name: string; title: string; image: string; description: string }, i: number) => i !== index);
    
    setAboutData({
      ...aboutData,
      team: {
        ...aboutData.team,
        members: newMembers
      }
    });
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">加载关于页数据中...</p>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          刷新页面
        </button>
      </div>
    );
  }

  // 显示无数据状态
  if (!aboutData) {
    return (
      <div className="p-6 text-center">
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded">
          <p>没有找到关于页数据</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          刷新页面
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* 成功提示 */}
      {saveSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded">
          <p>保存成功！</p>
        </div>
      )}
      
      {/* 错误提示 */}
      {saveError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
          <p>{saveError}</p>
        </div>
      )}
      
      {/* 使命与特色部分 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">使命与特色</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">标题</label>
          <input
            type="text"
            value={aboutData.mission.title}
            onChange={(e) => setAboutData({
              ...aboutData,
              mission: { ...aboutData.mission, title: e.target.value }
            })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">内容段落</label>
          <div className="space-y-4">
            {aboutData.mission.content.map((paragraph, index) => (
              <div key={index} className="flex items-start gap-2">
                <textarea
                  value={paragraph}
                  onChange={(e) => handleContentChange(e.target.value, index)}
                  rows={3}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => removeParagraph(index)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addParagraph}
            className="mt-2 flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <PlusIcon className="h-5 w-5" /> 添加段落
          </button>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">特色功能</label>
          <div className="space-y-4">
            {aboutData.mission.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(
                      { ...feature, title: e.target.value },
                      index
                    )}
                    placeholder="特色标题"
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(
                      { ...feature, description: e.target.value },
                      index
                    )}
                    placeholder="特色描述"
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => removeFeature(index)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addFeature}
            className="mt-2 flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <PlusIcon className="h-5 w-5" /> 添加特色
          </button>
        </div>
      </div>
      
      {/* 历史部分 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">历程</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">标题</label>
          <input
            type="text"
            value={aboutData.history.title}
            onChange={(e) => setAboutData({
              ...aboutData,
              history: { ...aboutData.history, title: e.target.value }
            })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">历史事件</label>
          <div className="space-y-4">
            {aboutData.history.events.map((event, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={event.year}
                    onChange={(e) => handleHistoryChange(
                      { ...event, year: e.target.value },
                      index
                    )}
                    placeholder="年份"
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={event.description}
                    onChange={(e) => handleHistoryChange(
                      { ...event, description: e.target.value },
                      index
                    )}
                    placeholder="事件描述"
                    className="md:col-span-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => removeHistoryEvent(index)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addHistoryEvent}
            className="mt-2 flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <PlusIcon className="h-5 w-5" /> 添加历史事件
          </button>
        </div>
      </div>
      
      {/* 团队部分 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">团队</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">标题</label>
          <input
            type="text"
            value={aboutData.team.title}
            onChange={(e) => setAboutData({
              ...aboutData,
              team: { ...aboutData.team, title: e.target.value }
            })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">团队成员</label>
          <div className="space-y-6">
            {aboutData.team.members.map((member, index) => (
              <div key={index} className="p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg">{member.name || '新成员'}</h4>
                  <button
                    onClick={() => removeTeamMember(index)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">姓名</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(
                        { ...member, name: e.target.value },
                        index
                      )}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">职位</label>
                    <input
                      type="text"
                      value={member.title}
                      onChange={(e) => handleTeamMemberChange(
                        { ...member, title: e.target.value },
                        index
                      )}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 text-sm">图片 URL</label>
                  <input
                    type="text"
                    value={member.image}
                    onChange={(e) => handleTeamMemberChange(
                      { ...member, image: e.target.value },
                      index
                    )}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">介绍</label>
                  <textarea
                    value={member.description}
                    onChange={(e) => handleTeamMemberChange(
                      { ...member, description: e.target.value },
                      index
                    )}
                    rows={3}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addTeamMember}
            className="mt-2 flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <PlusIcon className="h-5 w-5" /> 添加团队成员
          </button>
        </div>
      </div>
      
      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 flex items-center gap-2 ${
            saving ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              保存中...
            </>
          ) : '保存更改'}
        </button>
      </div>
    </div>
  );
} 